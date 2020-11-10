import resizeComponent from '~scripts/utils/resize';
import App from '~scripts/common/app';
import './slider-header.scss';

const $sliderHeader = $('.js-slider-header');
if ($sliderHeader.length > 0) {
    // Slider init only on desktop
    // Slider is replaced by image on mobile (use css)
    resizeComponent.addMediaQuery({
        min: 480,
        max: 10000,
        onFirstEnter: () => {
            ((_root) => {
                const self = {
                    root: _root,
                    carousel: _root.find('.js-slider'),
                    nextBtn: _root.find('.js-nav-next'),
                    prevBtn: _root.find('.js-nav-prev'),
                    counter: _root.find('.js-nav-counter'),
                    animation: 'flipInX',
                };

                function renderCounter(slideCount, currentSlide) {
                    self.counter.html(`<span>${currentSlide}</span>/${slideCount}`);
                }

                if (self.carousel.find('.item').length > 1) {
                    self.carousel.addClass('owl-carousel');

                    self.carousel.owlCarousel({
                        rtl: App.isRtl,
                        nav: false,
                        dots: true, // must be enabled for slide counter
                        loop: true,
                        autoplay: true,
                        autoplayTimeout: 5000,
                        autoplayHoverPause: true,
                        items: 1,
                        onInitialized: (event) => {
                            self.root.addClass('is-initialized');
                            renderCounter(event.item.count, 1);
                        },
                        onChanged: (event) => {
                            renderCounter(event.item.count, event.page.index + 1);
                        },
                    });

                    self.nextBtn.click(() => {
                        self.carousel.trigger('next.owl.carousel');
                    });

                    self.prevBtn.click(() => {
                        self.carousel.trigger('prev.owl.carousel');
                    });
                } else {
                    self.nextBtn.remove();
                    self.prevBtn.remove();
                }
            })($sliderHeader);
        },
    });
}
