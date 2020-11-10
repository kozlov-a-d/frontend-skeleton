import photoswipeWrapper from '~scripts/components/photoswipe.wrapper';
import * as InstagramFeed from '~vendor/instafeed.min';
import './instagram-widget.scss';

/**
 * Подтягиваем картинки с инсты
 *
 * Хтмлка:
    <div class="instagram-widget-carousel js-instagram-widget-carousel">
        <div class="instagram-widget-carousel__list js-instagram-widget-carousel-list" id="instafeed">
            // тут будут выводиться фотки
        </div>
    </div>
 */

if (document.querySelector('.js-instagram-widget')) {
    console.log();
    new InstagramFeed({
        username: 'darvinweb',
        callback: function (data) {
            const listContainer = document.querySelector('.js-instagram-widget-list');
            let listHTML = '';
            data.edge_owner_to_timeline_media.edges.forEach((element) => {
                listHTML += `
                <div class="instagram-widget__item">
                    <a href="${element.node.display_url}" data-size="${element.node.dimensions.width}x${element.node.dimensions.height}" class="instagram-widget__item-img">
                        <img src="${element.node.thumbnail_src}" decoding="async" loading="lazy" alt="${element.node.accessibility_caption}" />
                    </a>
                </div>`;
            });
            listContainer.innerHTML = listHTML;
            setTimeout(() => photoswipeWrapper.init('.js-instagram-widget-list', 'a:not(.no-photoswipe)'), 1);
        },
    });
}
