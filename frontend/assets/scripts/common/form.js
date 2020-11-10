import $ from 'jquery';
import App from '~scripts/common/app';

$('body').on('submit', 'form.js-ajax', (e) => {
    e.preventDefault();

    const $form = $(e.currentTarget);
    const hasReCaptcha = $form.hasClass('js-is-grecaptcha');

    if ($form.data('submitted') && !hasReCaptcha) return;
    $form.data('submitted', true);

    if (!hasReCaptcha) App.addFullscreenPreloader();

    const options = {
        url: $form.attr('action') || '',
        type: $form.attr('method') || 'get',
        data: typeof FormData !== 'undefined' ? new FormData($form[0]) : $form.serialize(),
    };

    if (typeof FormData !== 'undefined') options.contentType = options.processData = false;

    if ($form.hasClass('js-is-grecaptcha') || !$form.has('.js-recaptcha').length) {
        $.ajax(options)
            .done((data) => {
                $(document).trigger(`app.form.${data.success ? 'success' : 'error'}`, {
                    $form,
                    data,
                });

                // App.notify(data.message, data.success ? 'success' : 'error');
                App.redirect(data.redirectUrl);

                // костыль для отправки форм на локалхосте
                if (window.location.hostname === 'localhost') {
                    const html = data;
                    data = {};
                    data.html = html;

                    App.trigger(App.events.form.success, {
                        $form,
                    });
                }

                if (data.html) {
                    const $html = $(data.html);

                    // если в ответе сервера форма, то вставляем именно её
                    // иначе вставляем ответ целиком
                    if ($html.find('form').length > 0) {
                        $form.replaceWith($html.find('form'));
                    } else {
                        $form.replaceWith($html);
                    }

                    App.trigger(App.events.ajax.html, {
                        $html: $html.parent(),
                    });

                    СoMagicSendData(data);

                    // TODO: разкоментировать, когда уберем отправку из шаблона
                    // metrikaEcommerceSendData(data);
                }
            })
            .always(() => {
                $form.removeData('submitted');
            })
            .fail(App.onAjaxFail);
    } else {
        recaptchaCheck($form);
    }
});

const recaptchaCheck = ($form) => {
    $form.addClass('js-is-grecaptcha');
    if (typeof grecaptcha !== 'undefined') grecaptcha.execute($form.data('widget-id'));
    else console.warn('Не подключен скрипт reCaptcha');
};

/**
 * Проверяет данные формы и отправляет их в сервис CoMagic
 * @param {Object} ajaxResponseData
 */
const СoMagicSendData = (ajaxResponseData) => {
    if (typeof window.Comagic === 'undefined') return;
    // console.log('пришло', ajaxResponseData);
    if (typeof ajaxResponseData.data !== 'object') return;
    let result = {
        name: ajaxResponseData.data.name,
        email: ajaxResponseData.data.email,
        phone: ajaxResponseData.data.phone,
    };
    if (ajaxResponseData.orderType === 'ecommerce') {
        let message = `Заказ №${ajaxResponseData.data.number}\n\n`;
        ajaxResponseData.metrikaEvents[0].ecommerce.purchase.products.forEach((product) => {
            message += `${product.name} (${product.category}) кол-во ${product.quantity} \n`;
            message += `${product.variant}\n`;
            if (product.extras && product.extras.details) message += `Комментарий к товару: ${product.extras.details}\n`;
            message += `\n`;
        });
        message += `Сумма: ${ajaxResponseData.metrikaEvents[0].ecommerce.purchase.actionField.revenue}руб.\n\n`;
        message += `Адрес: ${ajaxResponseData.data.address}\n\n`;
        message += `Комментарий: ${ajaxResponseData.data.text}`;
        result.message = message;
    } else {
        result.message = ajaxResponseData.data.text;
    }
    console.log('отправим', result);
    window.Comagic.addOfflineRequest(result);
};

/**
 * Отправляет ecommerce данные в метрику
 * @param {Object} ajaxResponseData
 */
const metrikaEcommerceSendData = (ajaxResponseData) => {
    if (typeof window.dataLayer === 'undefined' || typeof ajaxResponseData.metrikaEvents[0] === 'undefined') return;
    ajaxResponseData.metrikaEvents[0].forEach((event) => {
        window.dataLayer.push(event);
    });
};
