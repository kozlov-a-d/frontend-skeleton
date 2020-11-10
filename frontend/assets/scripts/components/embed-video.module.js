/**
 * Модуль для вставки видео с youtube
 * Example: <div class="video js-embed-video"
 *              data-type="youtube"
 *              data-id="6Gar6lnh2PI"
 *              data-img="http://via.placeholder.com/1170x658/cccccc/000000"
 *          ></div>
 * @type {{init}}
 */

const embedVideoModule = (() => {
    /**
     * @param {String} selector
     */
    const init = (selector) => {
        const videos = document.querySelectorAll(selector);

        videos.forEach((element) => {
            if (element.dataset.type === 'youtube') {
                if (element.dataset.img) {
                    element.style.backgroundImage = `url(${element.dataset.img})`;
                } else {
                    element.style.backgroundImage = `url(https://i.ytimg.com/vi/${element.dataset.id}/sddefault.jpg)`;
                }

                const play = document.createElement('div');
                play.setAttribute('class', 'play');
                element.appendChild(play);

                element.addEventListener('click', (e) => {
                    const iframe = document.createElement('iframe');
                    let iframeUrl = `https://www.youtube.com/embed/${element.dataset.id}?autoplay=1&autohide=1`;
                    if (element.getAttribute('data-params')) iframeUrl += `&${element.getAttribute('data-params')}`;
                    iframe.setAttribute('allow', 'autoplay');
                    iframe.setAttribute('src', iframeUrl);
                    iframe.setAttribute('frameborder', '0');

                    element.appendChild(iframe, this);

                    e.target.removeEventListener('click', () => {});
                });
            }
        });
    };

    // PUBLIC ==========================================================================================================

    return Object.freeze({
        /**
         *
         */
        init,
    });
})();

export default embedVideoModule;
