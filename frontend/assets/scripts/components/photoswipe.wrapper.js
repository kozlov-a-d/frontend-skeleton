import * as PhotoSwipe2 from 'photoswipe';
import * as PhotoSwipeUIDefault2 from 'photoswipe/dist/photoswipe-ui-default';

const PhotoSwipe = PhotoSwipe2.default;
const PhotoSwipeUIDefault = PhotoSwipeUIDefault2.default;

/**
 * Компонент для упрощения инициализации photoswipe
 * @type {{init}}
 */
const photoswipeWrapper = (() => {
    const photoswipeProps = {
        isExist: false,
        html: null,
        selector: {
            container: '',
            item: '',
        },
    };

    // PRIVATE ============================================================================================

    /* add HTML  */
    const addHTML = () => {
        const html = document.createElement('div');
        html.classList.add('pswp');
        html.innerHTML = `
            <div class="pswp__bg"></div>
                <div class="pswp__scroll-wrap">
                    <div class="pswp__container">
                        <div class="pswp__item"></div>
                        <div class="pswp__item"></div>
                        <div class="pswp__item"></div>
                    </div>
                    <div class="pswp__ui pswp__ui--hidden">
                        <div class="pswp__top-bar">
                            <div class="pswp__counter"></div>
                            <button class="pswp__button pswp__button--close" title="Close (Esc)"></button>
                            <button class="pswp__button pswp__button--share" title="Share"></button>
                            <button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>
                            <button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>
                            <div class="pswp__preloader">
                                <div class="pswp__preloader__icn">
                                    <div class="pswp__preloader__cut">
                                        <div class="pswp__preloader__donut"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
                        <div class="pswp__share-tooltip"></div>
                    </div>
                    <button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></button>
                    <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></button>
                    <div class="pswp__caption"><div class="pswp__caption__center"></div></div>
                </div>
            </div>`;
        document.getElementsByTagName('body')[0].appendChild(html);

        return html;
    };

    /* add handler */
    const addHandler = (container, el, html) => {
        const containers = document.querySelectorAll(container);
        containers.forEach((_container) => {
            const items = _container.querySelectorAll(el);
            items.forEach((item) => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();

                    const self = (e.target.tagName === 'a') ? e.target : e.target.closest('a');
                    const elements = self.closest(container).querySelectorAll(el);
                    const slides = []; // массив слайдов

                    for (let i = 0; i < elements.length; i++) {
                        const size = elements[i].getAttribute('data-size').split('x'); // размер текущего изображения
                        slides[i] = {
                            src: elements[i].getAttribute('href'), // адрес картинки
                            w: size[0],
                            h: size[1],
                        };
                    }

                    let index = 0;
                    for (let y = 0; y < elements.length; y++) {
                        if (elements[y] === self) { index = y; }
                    }

                    const options = {
                        shareEl: false,
                        index,
                    };

                    const gallery = new PhotoSwipe(html, PhotoSwipeUIDefault, slides, options);
                    gallery.init();

                    return false;
                });
            });
        });
    };

    // INIT ===============================================================================================

    if (typeof PhotoSwipe === 'function') {
        photoswipeProps.isExist = true;
    } else {
        console.warn('photoswipeComponent: PhotoSwipe not found');
    }

    // PUBLIC =============================================================================================

    return Object.freeze({
        init(container, item) {
            let html = document.querySelector('.pswp');
            if (html === null) {
                html = addHTML();
            }
            if (photoswipeProps.isExist && document.querySelector(container)) {
                addHandler(container, item, html);
            }
        },
    });
})();


export default photoswipeWrapper;
