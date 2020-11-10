import $ from 'jquery';
import App from '~scripts/common/app';

/**
 * Скрипт для инициализации датапикеров
 *
 * Инициализируется при загрузке страницы для всего body
 * и при ajax для html'а, который пришщёл вместе с событием
 *
 * Docs: http://t1m0n.name/air-datepicker/docs/index-ru.html
 */

$(() => {
    let init;
    const selectors = {
        date: '.js-datepicker',
        time: '.js-timepicker',
    };

    function addDatapickerLanguage() {
        $.fn.datepicker.language.ru = {
            days: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
            daysShort: ['Вос', 'Пон', 'Вто', 'Сре', 'Чет', 'Пят', 'Суб'],
            daysMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
            months: [
                'Январь',
                'Февраль',
                'Март',
                'Апрель',
                'Май',
                'Июнь',
                'Июль',
                'Август',
                'Сентябрь',
                'Октябрь',
                'Ноябрь',
                'Декабрь',
            ],
            monthsShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
            today: 'Сегодня',
            clear: 'Очистить',
            dateFormat: 'dd.mm.yyyy',
            timeFormat: 'hh:ii',
            firstDay: 1,
        };

        $.fn.datepicker.language.en = {
            days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            daysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            daysMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
            months: [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December',
            ],
            monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            today: 'Today',
            clear: 'Clear',
            dateFormat: 'dd.mm.yyyy',
            timeFormat: 'hh:ii aa',
            firstDay: 0,
        };

        $.fn.datepicker.language.ar = {
            days: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
            daysShort: ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'],
            daysMin: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
            months: [
                'يناير',
                'فبراير',
                'مارس',
                'أبريل',
                'مايو',
                'يونيو',
                'يوليو',
                'أغسطس',
                'سبتمبر',
                'أكتوبر',
                'نوفمبر',
                'ديسمبر',
            ],
            monthsShort: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
            today: 'اليوم',
            clear: 'إغلاق',
            dateFormat: 'mm/dd/yyyy',
            timeFormat: 'hh:ii aa',
            firstDay: 7,
        };
    }

    (init = (context) => {
        const $context = $(context || 'body');

        if (document.querySelectorAll(selectors.date).length || document.querySelectorAll(selectors.time).length) {
            import(/* webpackChunkName: "air-datepicker" */ 'air-datepicker/dist/js/datepicker')
                .then(() => {
                    // ru | en | ar
                    addDatapickerLanguage();

                    // date
                    $context.find(selectors.date).each((index, el) => {
                        $(el).datepicker({
                            language: App.lang,
                            minDate: new Date(),
                        });
                    });

                    // time
                    $context.find(selectors.time).each((index, el) => {
                        $(el).datepicker({
                            language: App.lang,
                            dateFormat: ' ',
                            timepicker: true,
                            classes: 'only-timepicker',
                        });
                    });
                })
                .catch((error) => `An error occurred while loading the component (air-datepicker) - ${error}`);
        }
    })();

    App.onAjaxStream.push(() => {
        init();
    });
});
