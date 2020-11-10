import '~vendor/jquery-ui/jquery-ui.scss';
import './product-filter-smart.scss';
import '~vendor/jquery-ui/jquery-ui';
import App from '~scripts/common/app';
import FilterSmart from './filter-smart';
import localStorageComponent from '~scripts/utils/localstorage';

/**
 * Умный фильтр
 */
App.initComponent('.js-filter-smart', (el) => {
    new FilterSmart(el, {
        selectors: {
            prop: '.js-filter-smart-prop',
            selected: '.js-filter-smart-selected',
            value: '.js-filter-smart-value',
            params: '.js-filter-smart-params',
            btn: '.js-filter-smart-btn-apply',
            updated: '.l-main',
        },
        paramsKeep: ['sort', 'direction'],
    });
});

/**
 * Скрипт для инициализации слайдера цен
 *
 * Инициализируется при загрузке страницы для всего body
 * и при ajax для html'а, который пришщёл вместе с событием
 */

(() => {
    let init;
    const selectors = {
        wrapper: '.js-price-range',
        slider: '.products-filter-smart__price-slider',
        minInput: '.products-filter-smart__price--min',
        maxInput: '.products-filter-smart__price--max',
    };
    (init = (context) => {
        const $context = $(context || 'body');
        $context.find(selectors.wrapper).each((index, el) => {
            ((_root) => {
                const self = {
                    slider: _root.find(selectors.slider),
                    min: _root.find(selectors.minInput),
                    max: _root.find(selectors.maxInput),
                };
                console.log(self.slider);
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

function stateFromLocalStorage() {
    const state = [];
    if (localStorageComponent.exist('spoliers')) {
        const sloilerState = localStorageComponent.state('spoliers');
        sloilerState.forEach((item) => state.push(item));
    }
    return state;
}

function updateState(state, updateValue) {
    let newState = state;
    const isExist = state.filter((item) => item.name === updateValue.name).length;
    console.log(isExist);
    if (!isExist) {
        newState.push(updateValue);
    } else {
        newState.forEach((item) => {
            if (item.name === updateValue.name) item.isOpen = updateValue.isOpen;
        });
    }

    localStorageComponent.state('spoliers', newState);
    return newState;
}

(() => {
    let state = stateFromLocalStorage();
    if (!document.querySelector('.js-filter-smart')) return;
    const spoilers = document.querySelectorAll('[data-spoiler]');
    if (!spoilers.length) return;

    spoilers.forEach((spoiler) => {
        const btn = spoiler.querySelector('[data-spoiler-btn]');
        const content = spoiler.querySelector('[data-spoiler-content]');

        content.dataset.height = content.scrollHeight;
        content.style.height = content.dataset.height;
        // content.style.overflow = 'hidden';

        spoiler.dataset.open = spoiler.dataset.open == 'true';
        if (spoiler.dataset.open == 'false') content.style.height = 0;

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const isOpen = spoiler.dataset.open == 'true';
            if (isOpen) {
                content.style.height = '0';
            } else {
                content.style.height = `${content.dataset.height}px`;
            }
            spoiler.dataset.open = !isOpen;

            const newVal = {
                name: spoiler.querySelector('.js-filter-smart-prop').dataset.slug,
                isOpen: !isOpen,
            };
            state = updateState(state, newVal);

            return false;
        });
    });

    state.forEach((item) => {
        const filterElement = document.querySelector(`[data-slug="${item.name}"]`);
        if (item.isOpen && filterElement) {
            const spoiler = filterElement.closest('[data-spoiler]');
            if (!spoiler) return;
            const content = spoiler.querySelector('[data-spoiler-content]');
            spoiler.dataset.open = spoiler.dataset.open == 'true';
            content.style.height = `${content.dataset.height}px`;
        }
    });

    state = [];
})();
