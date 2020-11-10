// import $ from 'jquery';
import App from '~scripts/common/app';
import './product-widget-carousel.scss';

const $productsWidget = $('.js-product-widget-carousel');
if ($productsWidget.length > 0) {
    ((_root) => {
        const self = {
            carousel: _root.find('.owl-carousel'),
            nextBtn: _root.find('.js-nav-next'),
            prevBtn: _root.find('.js-nav-prev'),
        };

        self.carousel.owlCarousel({
            rtl: App.isRtl,
            nav: false,
            dots: false,
            loop: true,
            items: 4,
            margin: 21,
            responsive: {
                0: { items: 1 },
                480: { items: 2 },
                768: { items: 3 },
                1024: { items: 4 },
            },
        });
        self.nextBtn.click(() => {
            self.carousel.trigger('next.owl.carousel');
        });
        self.prevBtn.click(() => {
            self.carousel.trigger('prev.owl.carousel');
        });
    })($productsWidget);
}
