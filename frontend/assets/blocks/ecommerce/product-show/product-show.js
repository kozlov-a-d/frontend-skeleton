// import $ from 'jquery';
import App from '~scripts/common/app';
import '~scripts/components/tabs.jquery';
import './product-show.scss';

/**
 * PRODUCTS SHOW
 */
const $productShow = $('.js-product-show');
if ($productShow.length > 0) {
    (function productsShowBlock($root) {
        const $this = $root;

        const $self = {
            carousel: $this.find('.js-product-images-main'),
            thumb: $this.find('.js-product-images-thumb'),
            imgCount: $this.find('.js-product-images-main .js-item').length,
        };

        // CAROUSELS ==============================================================

        if ($self.imgCount > 1) {
            let flag = false;
            const duration = 300;

            // Thumbs carousel --------------------------------------------------------------

            $self.thumb.addClass('owl-carousel');

            $self.thumb.on('initialized.owl.carousel', (e) => {
                $self.thumb.addClass('is-initialized');
            });

            // Init carousel
            $self.thumb.owlCarousel({
                rtl: App.isRtl,
                margin: 11,
                items: 6,
                slideBy: 1,
                nav: false,
                dots: false,
                responsive: {
                    0: {
                        // breakpoint from 0 up
                        items: 5,
                    },
                    480: {
                        // breakpoint from 480 up
                        items: 6,
                    },
                    768: {
                        // breakpoint from 768 up
                        items: 9,
                    },
                    980: {
                        // breakpoint from 980 up
                        items: 6,
                    },
                },
            });

            $self.thumb.on('click', '.owl-item', (e) => {
                // $self.carousel.trigger('to.owl.carousel', [$(this).index(), duration, true]);
                // похоже что то поменялось, если что - пробовать верхний вариант
                $self.carousel.trigger('to.owl.carousel', [$(e.target).parents('.owl-item').index(), duration, true]);
            });

            $self.thumb.on('changed.owl.carousel', (e) => {
                if (!flag) {
                    flag = true;
                    $self.carousel.trigger('to.owl.carousel', [e.item.index, duration, true]);
                    flag = false;
                }
            });

            // Main carousel --------------------------------------------------------------

            $self.carousel.addClass('owl-carousel');

            // Select first item as current
            $self.carousel.on('initialized.owl.carousel', (e) => {
                setTimeout(() => {
                    $self.thumb.find('.owl-item').removeClass('current').eq(e.item.index).addClass('current');
                }, 10);
            });

            // Change current item
            $self.carousel.on('translate.owl.carousel', (e) => {
                $self.thumb.find('.owl-item').removeClass('current').eq(e.item.index).addClass('current');
            });

            $self.carousel.on('changed.owl.carousel', (e) => {
                if (!flag) {
                    flag = true;
                    $self.thumb.trigger('to.owl.carousel', [e.item.index, duration, true]);
                    flag = false;
                }
            });

            // Init carousel
            $self.carousel.owlCarousel({
                rtl: App.isRtl,
                items: 1,
                margin: 10,
                nav: true,
                dots: false,
            });
        }
    })($productShow);
}
