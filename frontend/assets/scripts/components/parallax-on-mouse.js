import { mergeDeep } from '~scripts/utils/common';
import requestAnimationFrameComponent from '~scripts/utils/request-animation-frame';

export default class ParallaxOnMouse {
    constructor(_root, _options) {
        this.root = _root;
        this.imgs = [...this.root.querySelectorAll('[data-parallax-on-mouse]')];
        this.pos = {
            x: 0,
            y: 0,
        };
        this.posCurr = {
            x: 0,
            y: 0,
        };
        this.rootSize = {
            x: this.root.clientWidth,
            y: this.root.clientHeight,
        };
        this.defaults = {
            koef: 0.3,
            friction: 0.1,
            inversion: true,
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

        self.root.addEventListener('mousemove', (event) => {
            self.pos = {
                x: (event.offsetX - self.rootSize.x / 2) * self.settings.koef,
                y: (event.offsetY - self.rootSize.y / 2) * self.settings.koef,
            };
        });

        requestAnimationFrameComponent.add(() => {
            self.render(self.imgs, self.posCurr, self.settings.inversion);
            self.update();
        });
    }

    update() {
        const offsetX = (this.pos.x - this.posCurr.x) * this.settings.friction;
        const offsetY = (this.pos.y - this.posCurr.y) * this.settings.friction;
        this.posCurr.x += Math.abs(offsetX) > 0.5 ? offsetX : 0;
        this.posCurr.y += Math.abs(offsetY) > 0.5 ? offsetY : 0;
    }

    render(imgs, posCurr, isInversion) {
        imgs.forEach((element) => {
            const depth = element.dataset.depth ? element.dataset.depth : 1;
            const direction = isInversion ? -1 : 1;
            element.style.transform = `translate3d(${posCurr.x * depth * direction}px, ${
                posCurr.y * depth * direction
            }px,0)`;
        });
    }

    resize() {
        this.rootSize = {
            x: this.root.clientWidth,
            y: this.root.clientHeight,
        };
    }
}
