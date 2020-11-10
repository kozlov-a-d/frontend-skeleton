import $ from 'jquery';
import { loadScript } from '~scripts/utils/load-assets';
import App from '~scripts/common/app';

import 'owl.carousel';
// import 'simplebar';
// import '@darvins/frontend/polyfills/polyfills';

import '~styles/app.scss';

// import '~scripts/components/tabs.jquery';
// import '~scripts/components/date-time-picker';

import '~scripts/common/form';
import '~scripts/common/inputmask';
import '~scripts/common/novalidate';
import '~scripts/common/goals';
import '~scripts/common/recaptcha';
// import '~scripts/common/menu-active';

// import '~blocks/blind-version/blind';

/**
 *  Кнопка скролящая наверх страницы
 */
import scrollTopModule from '~scripts/components/scroll-top.module';
scrollTopModule.init('.js-scroll-top', { offsetTop: 105 });

/**
 *  Кнопки скролящие к анкору на странице
 */
import Anchors from '~scripts/components/anchors';
App.initComponent('.js-anchor', (el) => {
    new Anchors(el);
});

/**
 * Вставка видео
 */
import embedVideoModule from '~scripts/components/embed-video.module';
document.addEventListener('DOMContentLoaded', () => {
    embedVideoModule.init('.js-embed-video');
});

/**
 * Всплывающие окна с аяксом
 */
import '~scripts/components/modal-ajax.jquery';
(function initModalAjax() {
    const init = (context) => {
        const $context = $(context || 'body');
        $context.find('.js-ajax:not(form)').modalAjax();
    };
    init();
    App.onAjaxStream.push(init);
})();

/**
 *  Генерируемые всплывающие окна
 */
// import '~scripts/components/old/modal-html.jquery';
// (function initModalHtml() {
//     const init = (context) => {
//         const $context = $(context || 'body');
//         $context.find('.js-modal').modalHtml();
//     };
//     init();
//     App.onAjaxStream.push(init);
// }());

/**
 * Add scrollbar for table on mobile
 */
import Tables from '~scripts/components/tables';
Tables.addMobileView('table');

/**
 * Кнопка печать
 */
import printModule from '~scripts/components/print.module';
printModule.init('.js-print');

/**
 * input[type="number"] with controls (+ -)
 */
import CustomInputNumber from '~scripts/components/custom-input-number';
App.initComponent('.js-custom-number', (el) => {
    new CustomInputNumber(el, {});
});

/**
 * Custom input[type="file"]
 */
import CustomInputFile from '~scripts/components/custom-input-file';
App.initComponent('.js-custom-file', (el) => {
    new CustomInputFile(el, {});
});

/**
 * Custom placeholder
 */
import CustomPlaceholder from '~scripts/components/custom-placeholder';
App.initComponent('.js-custom-placeholder', (el) => {
    new CustomPlaceholder(el, {});
});

/**
 * Custom select
 */
import CustomSelect from '~scripts/components/custom-select';
App.initComponent('.js-custom-select', (el) => {
    new CustomSelect(el, {});
});

/**
 * Обёртка над фотосвайпом
 */
if (document.getElementsByClassName('js-photoswipe-gallery').length) {
    import(/* webpackChunkName: "photoswipe" */ '~scripts/components/photoswipe.wrapper')
        .then((module) => {
            const photoswipeWrapper = module.default;
            photoswipeWrapper.init('.js-photoswipe-gallery', 'a:not(.no-photoswipe)');
        })
        .catch((error) => `An error occurred while loading the component (photoswipe.wrapper) - ${error}`);
}

/**
 * Highslide
 */
if (document.getElementsByClassName('bigpic').length) {
    import(/* webpackChunkName: "hs" */ '~vendor/highslide/highslide-full')
        .then((module) => {
            const hs = module.default;
            App.initComponent('.bigpic', (el) => {
                const link = el.parentNode;
                if (link.nodeName === 'A') {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        hs.expand(link);
                        return false;
                    });
                }
            });
        })
        .catch((error) => `An error occurred while loading the component (hs) - ${error}`);
}

// import ImagesZoomPopup from '~scripts/components/images-zoom-popup';
// export const bigpic = (() => {
//     let images = document.getElementsByClassName('bigpic');
//     if(!images.length) return false;

//     [].forEach.call(images, (img) => {
//         const link = img.parentNode;

//         if (link.nodeName === 'A') {
//             new ImagesZoomPopup(link);
//         }
//     })
// })();

/**
 * Tabs
 */
// import Tabs from '~scripts/components/tabs';
// App.initComponent('.js-tabs', (el) => {
//     new Tabs(el);
// });

/**
 * Spoiler Area
 */
import SpoilerContent from '~scripts/components/spoiler-content';
App.initComponent('.js-spoiler-content', (el) => {
    new SpoilerContent(el);
});

/**
 * Spoiler List items
 */
import SpoilerList from '~scripts/components/spoiler-list';
App.initComponent('.js-spoiler-list', (el) => {
    new SpoilerList(el);
});

/**
 * Yandex maps
 */
import MapYandex from '~scripts/components/maps';
export const initMapYandex = (() => {
    const apiUrl = 'https://api-maps.yandex.ru/2.1/?apikey=a093acd9-ac0d-4425-b81d-2ece98effc36&lang=ru_RU';
    const elements = document.getElementsByClassName('js-map-yandex');

    if (!elements.length) return false;

    document.addEventListener('DOMContentLoaded', () => {
        if (typeof IntersectionObserver == 'function') {
            const nodesObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        observer.unobserve(entry.target);
                        loadScript(apiUrl)
                            .then(() => {
                                new MapYandex(entry.target, {});
                                return true;
                            })
                            .catch();
                    }
                });
            });

            [].forEach.call(elements, (element) => {
                nodesObserver.observe(element);
            });
        } else {
            [].forEach.call(elements, (element) => {
                loadScript(apiUrl)
                    .then(() => {
                        new MapYandex(element, {});
                        return true;
                    })
                    .catch();
            });
        }
    });
})();

/* eslint-disable no-useless-escape */
document.addEventListener('DOMContentLoaded', () => {
    const str = `
    BE HAPPY =)

     /\\__/\\
    /\`    \'\\
  === 0  0 ===
    \\  --  /
   /        \\
  /          \\
 |            |
  \\  ||  ||  /
   \\_oo__oo_/#######o

link to docs: http://frontend-docs.dev.darvins.ru/docs/get-started.html
    `;
    console.log(str);
});
