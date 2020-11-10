/* eslint-disable */

import App from '~scripts/common/app';
import scrollComponent from '~scripts/utils/scroll';
import { animationEvent } from '~scripts/utils/dom-events';

(function ($) {
    let defaults = {
        // дефолтные опции
        animation: '',

        template: function (params) {
            return `
                <div class="modal ${params.dataClass}" id="${params.id}">
                    <div class="modal__wrapper">
                        <div class="modal__bg js-modal-close"></div>
                        <div class="modal__container">
                            <button class="modal__btn-close js-modal-close">Close</button>
                            <div class="modal__scroll">${params.html} </div>
                        </div>
                        <div class="modal__loader"></div>
                    </div>
                </div>`;
        },
    };

    let options;

    let methods = {
        init: function (options) {
            options = $.extend({}, defaults, options);

            this.each(function () {
                let modalId = 'modal-' + Math.round(Math.random() * 999999);

                $(this).on('click', function (e) {
                    e.preventDefault();

                    let $link = $(this);
                    let additionalText = $link.data('text'); // текст который нужно засунуть в textarea
                    let isCloseOther = $link.data('closeOther') === true ? true : false;

                    if ($link.data('clicked')) {
                        return;
                    }

                    if (isCloseOther) {
                        let $modal = $('.modal').first();

                        $modal.on(animationEvent, function () {
                            $modal.remove();
                            $('body').css('position', 'static');
                        });
                        $modal.addClass('closing');
                    }

                    $link.data('clicked', true).addClass('-loading');

                    $.ajax({
                        url: $link.attr('data-href') ? $link.attr('data-href') : $link.attr('href'),
                    })
                        .done(function (html) {
                            let $html = $(
                                options.template({
                                    id: modalId,
                                    dataClass: $link.attr('data-class'),
                                    html: html,
                                })
                            );

                            if (additionalText) {
                                $html.find('textarea').val(additionalText).change();
                            }

                            $('body').append($html);

                            setTimeout(function () {
                                scrollComponent.disable();
                                methods.addEventListener($('#' + modalId));
                                App.trigger(App.events.ajax.html, {
                                    $html: $html,
                                });
                                $html.find('input[required]:visible:first').trigger('focus');
                            }, 10);
                        })
                        .always(function () {
                            $link.removeData('clicked').removeClass('-loading');
                            $('.modal__loader').css({ opacity: 0, pointerEvents: 'none' });
                        })
                        .fail(App.onAjaxFail);
                });
            });
        },

        addEventListener: function (modal) {
            $(modal).on('click', '.js-modal-close', function (e) {
                e.preventDefault();
                scrollComponent.enable();
                console.log(animationEvent);
                let $modal = $('.modal');
                $modal.get(0).addEventListener(animationEvent, function () {
                    $('.modal').remove();
                    $('body').css('position', 'static');
                });
                $modal.addClass('closing');
            });
        },
    };

    $.fn.modalAjax = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Метод ' + method + ' не существует в jQuery.modalAjax');
        }
    };
})(jQuery);
