import jQuery from 'jquery';

/*
    v 1.0.0

    инициализация
    $('.tabs').tabs({});


    TODO: переключение по наведению
    TODO: плавная смена
    TODO: при переходе по ссылке с якорем, указывающим на номер таба, активируется соответствующий таб.
    TODO: запоминается активная вкладка после перезагрузки страницы

*/
(function tabsPlugin($) {
    const defaults = {
        className: '', // дополнительный класс если нужен
        startTab: 0, // значение по умолчанию, если не задано, отсчёт начинается с нуля
        onChange() { }, // функция вполняемая после каждой смены таба
        tabsId: 0,
        selectors: {
            navItem: '.tabs__nav-item',
            contentItem: '.tabs__content-item',
        },
    };

    const methods = {

        init(options) {
            options = $.extend({}, defaults, options);

            this.each(function each() {
                const container = $(this);
                const tabName = container.find(options.selectors.navItem);
                const tabContent = container.find(options.selectors.contentItem);
                // id для таба
                const tabsId = Math.floor((Math.random() * 1000000) + 1);

                container.addClass(options.className);
                container.attr('data-tab-id', tabsId);
                container.addClass('is-initialized'); // добавляем класс, по которому можно следить используется ли скрипт

                // смена таба
                const switchTabs = (num) => {
                    if (container.find(`[data-tab-id=${tabsId}][data-tab-num=${num}]`).hasClass('is-active')) {
                        container.find(`[data-tab-id=${tabsId}]`).removeClass('is-active');
                        container.find(`${options.selectors.contentItem}[data-tab-id=${tabsId}]`).hide();
                    } else {
                        container.find(`[data-tab-id=${tabsId}]`).removeClass('is-active');
                        container.find(`${options.selectors.contentItem}[data-tab-id=${tabsId}]`).hide();
                        container.find(`[data-tab-id=${tabsId}][data-tab-num=${num}]`).addClass('is-active');
                        container.find(`[data-tab-id=${tabsId}][data-tab-num=${num}]`).show();
                        container.find(`${options.selectors.contentItem}[data-tab-id=${tabsId}]`).removeClass('is-active');

                        const currentContent = container.find(`${options.selectors.contentItem}[data-tab-id=${tabsId}][data-tab-num=${num}]`);
                        currentContent.addClass('is-active');
                        options.onChange();
                    }
                };

                // добавляем значения
                tabName.each(function addId(index) { $(this).attr('data-tab-num', index); $(this).attr('data-tab-id', tabsId); });
                tabContent.each(function addId(index) { $(this).attr('data-tab-num', index); $(this).attr('data-tab-id', tabsId); });

                // выводим первый или указанный в опциях, если он возможен
                if (options.startTab !== 0 && options.startTab < tabName.length) { switchTabs(options.startTab); } else { switchTabs(0); }

                // нажатие на таб
                $(tabName).on('click', function tabClick() {
                    switchTabs($(this).attr('data-tab-num'));
                });
            });
        },

    };


    $.fn.tabs = function tabs(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        }
        $.error(`Метод ${method} не существует в jQuery.tabs`);
    };
}(jQuery));
