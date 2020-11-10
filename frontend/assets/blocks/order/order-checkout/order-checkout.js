import resizeComponent from '~scripts/utils/resize';
import requestAnimationFrameComponent from '~scripts/utils/request-animation-frame';
import './order-checkout.scss';

const $checkoutPage = $('.js-order-checkout');
if ($checkoutPage.length) {
    ((_root) => {
        const $root = _root;
        const $elements = {
            // layout
            formWrapper: $root.find('.js-order-checkout-form-wrapper'),
            cartWidget: $root.find('.js-order-checkout-cart-widget'),

            // recipient
            recipientSwitch: $root.find('.js-order-checkout-recipient'),
            recipientFragment: $root.find('.form-fragment.-recipient'),

            // delivery
            deliverySwitch: $root.find('input[name="checkout-delivery"]'),
            deliveryFragment: $root.find('.form-fragment.-delivery'),
            pickUpAtStoreFragment: $root.find('.form-fragment.-pickUpAtStore'),
        };

        // add event listner to switch recipient
        $elements.recipientSwitch.on('change', (e) => {
            const $this = $(e.target);
            if ($this.prop('checked')) {
                $elements.recipientFragment.addClass('is-show');
            } else {
                $elements.recipientFragment.removeClass('is-show');
            }
        });

        function updateDeliveryType() {
            let deliveryType = '';

            $elements.deliverySwitch.each((index, element) => {
                const $this = $(element);
                if ($this.prop('checked')) {
                    deliveryType = $this.val();
                }
            });

            if (deliveryType === 'delivery') {
                $elements.deliveryFragment.addClass('is-show');
                $elements.pickUpAtStoreFragment.removeClass('is-show');
            } else {
                $elements.deliveryFragment.removeClass('is-show');
                $elements.pickUpAtStoreFragment.addClass('is-show');
            }
        }
        // check default delivery type ( delivery | pickUpAtStore )
        updateDeliveryType();
        // add event listener onchange deliveryType
        $elements.deliverySwitch.on('change', () => {
            updateDeliveryType();
        });

        // initCartWidgetScroll
        (() => {
            if (
                $elements.formWrapper.height() > window.innerHeight &&
                $elements.cartWidget.height() < window.innerHeight
            ) {
                let scrollCurr = 0;
                let $block;
                let blockHeight;
                let startHeight;
                let availibleHeight;

                // check height and offset on each resize window
                resizeComponent.addMediaQuery({
                    min: 0,
                    max: 4096,
                    onEach() {
                        $block = $elements.cartWidget;
                        blockHeight = $block.height();
                        startHeight = $elements.formWrapper.offset().top;
                        availibleHeight = startHeight + $elements.formWrapper.height() - blockHeight;
                    },
                });

                // calculate transform value
                const scroll = () => {
                    scrollCurr = document.documentElement.scrollTop || window.pageYOffset || window.scrollY;
                    if (window.innerWidth > 980) {
                        if (scrollCurr >= startHeight && scrollCurr <= availibleHeight) {
                            $block.css({ transform: `translateY(${scrollCurr - startHeight}px)` });
                        } else if (scrollCurr <= startHeight) {
                            $block.css({ transform: 'translateY(0px)' });
                        } else {
                            $block.css({ transform: `translateY(${availibleHeight - startHeight}px)` });
                        }
                    } else {
                        $block.css({ transform: 'translateY(0px)' });
                    }
                };

                requestAnimationFrameComponent.add(scroll);
            }
        })();
    })($checkoutPage);
}
