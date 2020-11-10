// import '~vendor/IntersectionObserver.polyfill';  // полифил не особо актуален, при необходимости вернуть
/*

Example:
<img class="js-img-lazy" src="assets/images/placeholder.svg" data-src="image-to-lazy-load-1x.jpg"

lazyImageComponent([].slice.call(document.querySelectorAll("img.js-img-lazy")));
*/

const lazyImageComponent = (() => {
    const self = {
        isActive: false,
        observer: null,
    };

    if ('IntersectionObserver' in window) {
        self.isActive = true;
        self.observer = new IntersectionObserver(((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    // lazyImage.srcset = lazyImage.dataset.srcset;
                    // lazyImage.classList.remove(self.defaultClass);
                    self.observer.unobserve(lazyImage);
                }
            });
        }));
    } else {
        self.isActive = false;
    }

    const add = (elements) => {
        if (self.isActive) {
            elements.forEach((lazyImage) => {
                self.observer.observe(lazyImage);
            });
        } else {
            console.warn('IntersectionObserver not found. Fallback used.');
            elements.forEach((lazyImage) => {
                lazyImage.src = lazyImage.dataset.src;
            });
        }
    };

    return Object.freeze({
        add,
    });
})();

export default lazyImageComponent;
