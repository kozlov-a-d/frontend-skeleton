/* eslint-disable */

// import $ from 'jquery';
import App from '~scripts/common/app';
import scrollComponent from '~scripts/utils/scroll';
import { animationEvent } from '~scripts/utils/dom-events';

(function ($) {
    let defaults = {
        // дефолтные опции
        animation: '',
        title: '',
        html: 'Content...',
        minResolution: 1023,
        template: function (params) {
            return `
                <div class="modal ${params.dataClass}" id="${params.id}">
                    <div class="modal__wrapper">
                        <div class="modal__bg js-modal-close"></div>
                        <div class="modal__container">
                            <button class="modal__btn-close js-modal-close">Close</button>
                            <div class="modal__title">${params.title}</div>
                            <div class="modal__scroll">${params.html}</div>
                        </div>
                    </div>
                </div>`;
        },
    };
    let options;

    let html = {
        $body: $('body'),
        $modal: null,
    };

    let methods = {
        init: function (_options) {
            options = $.extend({}, defaults, _options);

            this.each(function () {
                let modalId = 'modal-' + Math.round(Math.random() * 999999);
                $(this).on('click', function (e) {
                    if (window.innerWidth <= options.minResolution) {
                        e.preventDefault();

                        let $link = $(this);

                        let $html = $(
                            options.template({
                                id: modalId,
                                dataClass: $link.attr('data-class'),
                                html: options.html,
                                title: options.title,
                            })
                        );
                        html.$modal = $html;
                        html.$body.append($html);
                        html.$body.addClass('has-modal');

                        setTimeout(function () {
                            scrollComponent.disable();
                            methods.addEventListener($('#' + modalId));
                            App.trigger(App.events.ajax.html, {
                                $html: $html,
                            });
                        }, 10);
                    }
                });
            });
        },

        addEventListener: function (modal) {
            $(modal).on('click', '.js-modal-close', function (e) {
                e.preventDefault();
                scrollComponent.enable();
                let $modal = $('.modal');
                $modal.get(0).addEventListener(animationEvent, function () {
                    $('.modal').remove();
                    $('body').css('position', 'static');
                });
                $modal.addClass('closing');
            });
        },
    };

    $.fn.modalHtml = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Метод ' + method + ' не существует в jQuery.modalHtml');
        }
    };
})(jQuery);
