import scrollComponent from '~scripts/utils/scroll';
import { mergeDeep } from '~scripts/utils/common';
import { getElementCoords } from '~scripts/utils/common';

export default class Anchors {
    constructor(_root, _options) {
        this.root = _root;
        this.defaults = {};
        this.settings = mergeDeep(this.defaults, _options);

        this.root.addEventListener('click', (e) => {
            e.preventDefault();
            const el = document.querySelector(this.root.getAttribute('href'));
            if (el) {
                const positionTo = getElementCoords(el).top;
                scrollComponent.moveTo(positionTo);
            } else {
                console.warn(`Anchors: element ${this.root.getAttribute('href')} not found`);
            }
            return false;
        });
    }
}
