import App from '~scripts/common/app';
import { loadScript } from '~scripts/utils/load-assets';

(function initRecaptcha() {
    // let reCaptchaSiteKey = null;
    // let reCaptchaToken = null;

    // const reCaptchaInit = ($elements) => {
    //     $elements.each(function () {
    //         // $(this).val(token);
    //     });
    // };

    const initRecaptchaHandler = (event) => {
        const form = event.target.closest('form');
        const reCaptchaPlaceholder = form.querySelector('.js-recaptcha');
        const reCaptchaSiteKey = reCaptchaPlaceholder.dataset.sitekey;
        loadScript(`https://www.google.com/recaptcha/api.js?render=${reCaptchaSiteKey}`).then(() => {
            const { grecaptcha } = window;
            grecaptcha.ready(function () {
                let widgetId = grecaptcha.render(reCaptchaPlaceholder, {
                    sitekey: reCaptchaSiteKey,
                    size: 'invisible',
                    callback: 'recaptchaCallback',
                });
                form.setAttribute('data-widget-id', widgetId);
            });
        });
        form.removeEventListener('click', initRecaptchaHandler);
    };

    const init = (context) => {
        const $context = $(context || 'body');
        const $elements = $context.find('.js-recaptcha');
        // const captchaSize = 'invisible';

        if (!$elements.length) return;

        $elements.each(function () {
            const form = this.closest('form');
            if (form) form.addEventListener('click', initRecaptchaHandler);
        });

        // if (reCaptchaToken) {
        //     reCaptchaInit($elements, reCaptchaToken);
        // } else {
        //     reCaptchaSiteKey = $elements.get(0).dataset.sitekey;
        //     loadScript(`https://www.google.com/recaptcha/api.js?render=${reCaptchaSiteKey}`).then(() => {
        //         const { grecaptcha } = window;
        //         grecaptcha.ready(function () {
        //             $elements.each(function () {
        //                 const node = this;

        //                 let widgetId = grecaptcha.render(node, {
        //                     sitekey: reCaptchaSiteKey,
        //                     size: captchaSize,
        //                     callback: 'recaptchaCallback',
        //                 });
        //                 $(node).closest('form').attr('data-widget-id', widgetId);
        //             });
        //         });
        //     });
        // }
    };
    init();
    App.onAjaxStream.push(init);
})();

const recaptchaCallback = () => {
    $('form.js-is-grecaptcha').submit();
};

window.recaptchaCallback = recaptchaCallback;
