import Component from '~scripts/abstracts/component';

// @ts-check

/**
 *  HTML:
 *  <div class="js-spoiler-content" data-is-open="false">
 *      <div data-spoiler-content class="display-md-block"></div>
 *      <button data-spoiler-btn class="btn-primary">Show more</button>
 *  </div>
 *
 *  OPTIONS:
 *  [data-is-open] - раскрыт ли по умолчанию
 *  [data-is-toggle-text] - меняется ли текст при открытие
 *  [data-text-open] - текст при раскрытом спойлере
 *  [data-text-close] - текст при свернутом спойлере
 *
 *  Автоматически скрывает контент при разрешнии меньше 980
 */

export default class Spoiler extends Component {
    /**
     * Spoiler
     * @param {HTMLElement} root
     * @param {[key: string]: any} options
     */
    constructor(root, options) {
        // Настройки по умолчанию
        const defaults = {
            name: 'Spoiler',
            selectors: {
                btn: '[data-spoiler-btn]',
                content: '[data-spoiler-content]',
            },
            data: {
                isOpen: false,
                isToggleText: false,
                textOpen: null,
                textClose: null,
            },
        };
        super(root, defaults, options);

        this.elements = this.findElements();
        this.init();
        this.elements.btn.addEventListener('click', this.handlerToogle.bind(this));
        window.addEventListener('resize', this.handlerOnResize.bind(this), { passive: true });
    }

    findElements() {
        let elements = {};
        Object.keys(this.selectors).forEach((selector) => {
            const element = this.root.querySelector(this.selectors[selector]);
            if (element) elements[selector] = element;
            else throw `[${this.name}] can't found element ${this.selectors[selector]}`;
        });
        return elements;
    }

    init() {
        this.elements.content.dataset.height = this.elements.content.scrollHeight.toString();
        this.elements.content.style.height = this.elements.content.dataset.height;
        this.elements.content.style.overflow = 'hidden';
        this.elements.content.style.transition = 'height 0.3s ease';
        if (!this.data.isOpen) this.close();
    }

    open() {
        this.elements.content.style.height = `${this.elements.content.dataset.height}px`;
        this.data.isOpen = true;
        this.root.classList.add('is-open');
        if (this.data.isToggleText) this.elements.btn.innerHTML = this.data.textOpen;
    }

    close() {
        this.elements.content.style.height = '0';
        this.data.isOpen = false;
        this.root.classList.remove('is-open');
        if (this.data.isToggleText) this.elements.btn.innerHTML = this.data.textClose;
    }

    toggle() {
        this.data.isOpen ? this.close() : this.open();
    }

    handlerToogle(event) {
        event.preventDefault();
        this.toggle();
        return false;
    }

    handlerOnResize() {
        this.elements.content.style.height = '';
        this.elements.content.dataset.height = this.elements.content.scrollHeight.toString();
        this.elements.content.style.height = `${this.elements.content.dataset.height}px`;
        if (!this.data.isOpen) this.close();
        else this.elements.content.dataset.height = this.elements.content.scrollHeight.toString();
        if (window.innerWidth <= 980) this.close();
    }
}
