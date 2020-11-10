import App from '~scripts/common/app';
import './reviews-widget.scss';

const $tempalteCarousel = $('.js-reviews-widget');
if ($tempalteCarousel.length > 0) {
    ((_root) => {
        const self = {
            carousel: _root.find('.owl-carousel'),
            nextBtn: _root.find('.js-nav-next'),
            prevBtn: _root.find('.js-nav-prev'),
        };

        self.carousel.owlCarousel({
            rtl: App.isRtl,
            nav: false,
            dots: true,
            loop: true,
            autoplay: true,
            autoplayTimeout: 5000,
            autoplayHoverPause: true,
            items: 1,
            onInitialized: () => {
                self.carousel.addClass('is-initialized');
            },
        });

        self.nextBtn.click(() => {
            self.carousel.trigger('next.owl.carousel');
        });

        self.prevBtn.click(() => {
            self.carousel.trigger('prev.owl.carousel');
        });
    })($tempalteCarousel);
}
