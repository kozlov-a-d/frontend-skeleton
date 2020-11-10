// @ts-check
import { toHTML } from '../utils/common';

const Preloader = (() => {
    const PRELOADER = toHTML('<img class="preloader" src="/assets/images/loader.svg" style="margin-left: 5px;">');
    const PRELOADER_FULLSCREEN = toHTML(
        '<div id="preloader-fullscreen" class="preloader" style="background: url(/assets/images/loader.svg) center no-repeat #28272d; background-size: 128px 128px; position: fixed; top: 0; bottom: 0; width: 100%; height: 100%; opacity: 0.4; z-index: 9999;">'
    );

    return Object.freeze({
        addFullscreenPreloader: () => {
            document.querySelector('body').append(PRELOADER_FULLSCREEN);
        },
        removeFullscreenPreloader: () => {
            const preloader = document.querySelector('#preloader-fullscreen');
            if (preloader) preloader.remove();
        },
        addPreloader: (element, method) => {
            element[method || 'append'](PRELOADER);
        },
    });
})();

export default Preloader;
