import scrollComponent from '~scripts/utils/scroll';

const scrollTopModule = (() => {
    const self = {
        btn: null,
        speed: 5000,
        offsetTop: 105,
    };

    const bindButton = (selector, callback) => {
        self.btn = document.querySelector(selector);
        if (self.btn) {
            callback();
        }
    };

    const checkScroll = () => {
        if (scrollComponent.current() > self.offsetTop) {
            self.btn.disabled = false;
        } else {
            self.btn.disabled = true;
        }
    };

    const addHandlerScroll = () => {
        window.addEventListener('scroll', () => {
            checkScroll();
        });
    };

    const addHandlerClick = () => {
        self.btn.addEventListener('click', (e) => {
            e.preventDefault();
            scrollComponent.moveTo(0);
            return false;
        });
    };

    return Object.freeze({
        init(selector, options) {
            bindButton(selector, () => {
                if (options.speed) {
                    self.speed = options.speed;
                }
                if (options.offsetTop) {
                    self.offsetTop = options.offsetTop;
                }
                checkScroll();
                addHandlerScroll();
                addHandlerClick();
            });
        },
    });
})();

export default scrollTopModule;
