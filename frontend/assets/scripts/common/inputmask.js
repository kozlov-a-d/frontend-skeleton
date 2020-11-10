import $ from 'jquery';
import App from '~scripts/common/app';

App.on(App.events.ajax.html, (args) => {
    const html = args.$html.get(0) || args.html;
    if (typeof $.fn.inputmask !== 'undefined') {
        html.find('input.js-inputmask-phone').inputmask('9', {
            repeat: '*',
        });
    }
});
