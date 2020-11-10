import $ from 'jquery';
import EventEmitter from './event-emitter';
import Preloader from './preloader';
import Translator from 'bazinga-translator';
window.Translator = Translator;

const App = (() => {
    const NOTIFICATION_TIMEOUT = 2000;

    const events = {
        ajax: {
            html: 'app.ajax.html',
        },
        form: {
            success: 'app.form.success', // args.$form
            error: 'app.form.error',
        },
        popup: {
            open: 'app.popup.open',
            close: 'app.popup.close',
        },
        cart: {
            add: 'app.cart.add',
        },
    };

    const breakpoints = {
        xxs: 375,
        xs: 414,
        sm: 568,
        md: 820,
        desktop: 980,
        lg: 1024,
        xl: 1280,
    };

    const isMobile = () => window.innerWidth <= breakpoints.desktop;

    const translate = (text) => (typeof Translator !== 'undefined' ? Translator.trans(text) : text);

    const notify = (text) => {
        if (!text || isMobile()) {
            return;
        }
        if (typeof Noty === 'undefined') {
            alert(translate(text));
        }

        // new Noty({
        //     text: translate(text),
        //     type,
        //     timeout: NOTIFICATION_TIMEOUT,
        //     theme: 'sunset',
        // }).show();
    };

    const lang = document.getElementsByTagName('html')[0].getAttribute('lang') || null;

    const isRtl = (() => {
        const html = document.getElementsByTagName('html')[0];
        return html.getAttribute('dir') === 'rtl' || html.getAttribute('lang') === 'ar';
    })();

    const onAjaxStream = [];

    /**
     * Init component on page load and ajax
     * @param {string} _selector
     * @param {function} _cb
     */
    const initComponent = (_selector, _cb) => {
        const init = (context) => {
            const ctx = context || document.getElementsByTagName('body')[0];
            const elements = [...ctx.querySelectorAll(_selector)];

            if (!elements.length) {
                return false;
            }

            elements.forEach((el) => {
                _cb(el);
            });
        };
        init();
        onAjaxStream.push(init);
    };

    return {
        lang,
        isRtl,
        events,
        on: EventEmitter.on,
        off: EventEmitter.off,
        trigger: EventEmitter.trigger,
        breakpoints,
        addFullscreenPreloader: Preloader.addFullscreenPreloader,
        removeFullscreenPreloader: Preloader.removeFullscreenPreloader,
        addPreloader: Preloader.addPreloader,
        notify,
        onAjaxFail: (jqXHR) => {
            if (jqXHR.status) {
                const translation = `error.message.${jqXHR.status}`;
                const translated = translate(translation);

                notify(translated !== translation ? translated : [jqXHR.status, jqXHR.statusText].join(' '), 'error');
            }
        },
        onAjaxStream,
        redirect: (url, immediately) => {
            if (url) {
                setTimeout(
                    () => {
                        location.href = url;
                    },
                    immediately ? 0 : NOTIFICATION_TIMEOUT / 2
                );
            }
        },
        translate,
        initComponent,
    };
})();

App.on(App.events.ajax.html, (args) => {
    console.log('Triggered App.events.ajax.html');

    const html = args.$html.get(0) || args.html;

    App.removeFullscreenPreloader();

    // перебираем все функции повешеные на аякс
    $.each(App.onAjaxStream, (index) => {
        if (typeof App.onAjaxStream[index] === 'function') {
            App.onAjaxStream[index](html);
        }
    });
});

window.App = App;
export default App;
