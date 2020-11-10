import App from '~scripts/common/app';
import './banner-widget.scss';

const $bannerWidget = $('.js-banner-widget');
if ($bannerWidget.length > 0) {
    ((_root) => {
        const self = {
            carousel: _root.find('.owl-carousel'),
        };

        self.carousel.owlCarousel({
            rtl: App.isRtl,
            // center: true,
            nav: false,
            dots: false,
            loop: true,
            // autoWidth: true,
            margin: 25,
            items: 3,
            responsive: {
                0: {
                    dots: true,
                    items: 1,
                },
                980: {
                    dots: false,
                    margin: 25,
                    items: 3,
                },
            },
        });
    })($bannerWidget);
}
