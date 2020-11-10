import { mergeDeep } from '~scripts/utils/common';

/**
 * Menu Smart
 */
export default class MenuSmart {
    constructor(_root, _options) {
        this.root = _root;
        this.defaults = {
            minResolution: 1000,
            extraWidth: 61,
        };
        this.elements = [];
        this.extraBar = null;
        this.settings = mergeDeep(this.defaults, _options);

        this.init();
    }

    init() {
        const rootNode = this.root.getElementsByClassName('is-root')[0];
        if (!rootNode) {
            console.warn(
                'Уважаемые тестировщики, косяк с меню (пункты меню не сворачиваются в бургер) связан с тем, что прогеры прохерили класс is-root у верхнего <ul>'
            );
            return false;
        }

        this.addExtraBar();

        // get list of items
        this.elements = this.parseElements();

        let rootWidthCurrent = rootNode.clientWidth;
        let rootWidthLast = 0;

        // on load
        this.onResize(rootWidthCurrent);

        // on resize
        window.addEventListener('resize', () => {
            // Update current root width
            rootWidthCurrent = rootNode.clientWidth;
            // Check for updates
            if (window.innerWidth > this.settings.minResolution && rootWidthCurrent !== rootWidthLast) {
                rootWidthLast = rootWidthCurrent;
                this.onResize(rootWidthCurrent);
            }
        });
    }

    parseElements() {
        const result = [];
        const original = [...this.root.querySelectorAll('.is-root > li:not(.-extraBar)')];
        const dubler = [...this.root.querySelectorAll('.is-dubler-root > li')];

        for (let i = 0; i < original.length; i++) {
            result.push({
                link: original[i],
                width: original[i].clientWidth,
                // isVisible: true,
                dubler: dubler[i],
            });
        }

        return result;
    }

    onResize(rootWidth) {
        let calcWidth = rootWidth;

        this.elements.forEach((element, index) => {
            calcWidth -= element.width;

            if (calcWidth < 0) {
                element.link.classList.add('-hidden');
                element.dubler.classList.remove('-hidden');
                this.extraBar.classList.remove('-hidden');
            } else if (index !== this.elements.length && calcWidth < this.settings.extraWidth) {
                element.link.classList.add('-hidden');
                element.dubler.classList.remove('-hidden');
                this.extraBar.classList.remove('-hidden');
            } else {
                element.link.classList.remove('-hidden');
                element.dubler.classList.add('-hidden');
                this.extraBar.classList.add('-hidden');
            }
        });
    }

    addExtraBar() {
        const root = this.root.getElementsByClassName('is-root')[0];
        const template = `
            <li class="-extraBar -has-dropdown -drop-down-inverse">
                <button>...</button>
                <div>
                    <ul class="is-dubler-root">${root.innerHTML}</ul>
                </div>
            </li>`;
        root.innerHTML += template;
        this.extraBar = this.root.getElementsByClassName('-extraBar')[0];
    }
}
