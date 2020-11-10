// import App from '~scripts/common/app';
import '~vendor/masonry.pkgd';
import './template-masonry.scss';

document.querySelectorAll('.js-template-masonry').forEach((item) => {
    let grid = item.querySelector('[data-masonry-grid]');

    const msnry = new Masonry(grid, {
        itemSelector: '.template-masonry__item',
        columnWidth: '.template-masonry__sizer',
        percentPosition: true,
    });

    const imgs = [...grid.querySelectorAll('img')];
    imgs.forEach((img) => {
        img.addEventListener('load', () => {
            msnry.layout();
        }, 1000);
    });
});
