import '~vendor/jquery-ui/jquery-ui.scss';
import './product-filter.scss';
import App from '~scripts/common/app';
import '~vendor/jquery-ui/jquery-ui';

/**
 * Скрипт для инициализации слайдера цен
 *
 * Инициализируется при загрузке страницы для всего body
 * и при ajax для html'а, который пришщёл вместе с событием
 *
 *
 */

(() => {
    let init;
    const selectors = {
        wrapper: '.js-price-range',
        slider: '.products-filter__price-slider',
        minInput: '.products-filter__price--min',
        maxInput: '.products-filter__price--max',
    };
    (init = (context) => {
        const $context = $(context || 'body');
        $context.find(selectors.wrapper).each((index, el) => {
            ((_root) => {
                console.log('rang1e', _root);
                const self = {
                    slider: _root.find(selectors.slider),
                    min: _root.find(selectors.minInput),
                    max: _root.find(selectors.maxInput),
                };

                self.slider.slider({
                    range: true,
                    min: +self.min.attr('min'),
                    max: +self.max.attr('max'),
                    values: [+self.min.val(), +self.max.val()],
                    slide: function (event, ui) {
                        self.min.val(ui.values[0]);
                        self.max.val(ui.values[1]);
                    },
                });
            })($(el));
        });
    })();

    App.onAjaxStream.push(() => {
        init();
    });
})();
