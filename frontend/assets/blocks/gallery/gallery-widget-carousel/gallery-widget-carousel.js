// import $ from 'jquery';
import App from '~scripts/common/app';
import './gallery-widget-carousel.scss';

const $galleryWidgetCarousel = $('.js-gallery-widget-carousel');
if ($galleryWidgetCarousel.length > 0) {
    ((_root) => {
        const self = {
            root: _root,
            carousel: _root.find('.owl-carousel'),
            nextBtn: _root.find('.js-nav-next'),
            prevBtn: _root.find('.js-nav-prev'),
        };

        self.carousel.owlCarousel({
            rtl: App.isRtl,
            center: true,
            nav: false,
            dots: false,
            loop: true,
            autoWidth: true,
            margin: 2,
        });

        self.nextBtn.click(() => {
            self.carousel.trigger('next.owl.carousel');
        });
        self.prevBtn.click(() => {
            self.carousel.trigger('prev.owl.carousel');
        });
    })($galleryWidgetCarousel);
}
