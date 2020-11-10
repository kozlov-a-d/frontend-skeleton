import scrollComponent from '~scripts/utils/scroll';
import { getElementCoords, mergeDeep } from '~scripts/utils/common';
import requestAnimationFrameComponent from '~scripts/utils/request-animation-frame';

export default class ParallaxOnScroll {
    constructor(_root, _options) {
        this.root = _root;
        this.interval = {
            start: 0,
            end: 0,
            length: 0,
        };
        this.imgs = [...this.root.querySelectorAll('[data-parallax-on-scroll]')];
        this.pos = 0;

        this.defaults = {
            friction: 0.1,
            inversion: false,
        };

        this.settings = mergeDeep(this.defaults, _options);

        this.init();
    }

    init() {
        const self = this;

        self.resize();
        window.addEventListener('resize', () => {
            self.resize();
            self.update();
        });

        requestAnimationFrameComponent.add(() => {
            if (!(scroll < self.interval.start || scroll > self.interval.end)) {
                self.render(self.imgs, self.pos, self.settings.inversion);
                self.update();
            }
        });
    }

    update() {
        const scroll = scrollComponent.current();
        this.pos = (scroll - this.interval.start) / this.interval.length;
    }

    render(imgs, posCurr, isInversion) {
        const rootHeight = this.root.clientHeight;
        imgs.forEach((element) => {
            const depth = element.dataset.depth ? element.dataset.depth : 1;
            const direction = isInversion ? 1 : -1;
            const offset = element.clientHeight - rootHeight;
            element.style.transform = `translateX(-50%) translateY(${posCurr * offset * depth * direction}px)`;
        });
    }

    resize() {
        const rootHeight = this.root.clientHeight;
        const rootOffsetTop = getElementCoords(this.root).top;
        const screenHeight = window.innerHeight;
        const rootEnd = rootOffsetTop + rootHeight;

        this.interval.start = rootOffsetTop - screenHeight;
        this.interval.end = rootEnd;
        this.interval.length = this.interval.end - this.interval.start;
    }
}
