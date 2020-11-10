import { mergeDeep } from '~scripts/utils/common';

/**
*
    <div class="form-item__field">
        <input type="text" placeholder="Имя" class="js-custom-placeholder">
        <div class="form-item__error"></div>
    </div>
*
*/

export default class CustomPlaceholder {
    constructor(_root, _options) {
        this.root = _root;
        this.html = {};
        this.defaults = {};

        this.settings = mergeDeep(this.defaults, _options);
        this.timer = null;

        this.init();
    }

    init() {
        const wrapper = this.createHtml(this.root);
        this.addEventListeners(wrapper);
    }

    createHtml(el) {
        const parentInput = el.parentNode;
        const wrapper = document.createElement('div');
        const placeholderText = el.getAttribute('placeholder');
        const placeholderElem = document.createElement('span');

        parentInput.prepend(wrapper);
        wrapper.classList.add('custom-placeholder');
        wrapper.append(el);

        placeholderElem.textContent = placeholderText;
        wrapper.append(placeholderElem);
        el.removeAttribute('placeholder');

        return wrapper;
    }

    addEventListeners(el) {
        let input;
        if (this.root.tagName == 'INPUT') {
            input = el.querySelector('input');
        } else if (this.root.tagName == 'TEXTAREA') {
            input = el.querySelector('textarea');
        } else {
            return;
        }

        if (input.value) {
            el.classList.add('-focus');
        }

        input.addEventListener('focus', () => {
            console.log('focus');
            el.classList.add('-focus');
        });
        input.addEventListener('blur', () => {
            console.log('blur');
            if (!input.value) {
                el.classList.remove('-focus');
            }
        });
    }
}
