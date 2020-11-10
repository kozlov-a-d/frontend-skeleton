import Component from '~scripts/abstracts/component';
import './tabs.scss';

// @ts-check

// TODO: проработать случай, когда табы внутри таба

export default class Tabs extends Component {
    /**
     * Tabs
     * @param {HTMLElement} root
     * @param {[key: string]: any} options
     */
    constructor(root, options) {
        // Настройки по умолчанию
        const defaults = {
            name: 'Tabs',
            selectors: {
                navItems: '[data-tabs-nav-items]',
                contentItems: '[data-tabs-content-items]',
            },
            data: {
                activeTab: 0,
            },
        };
        super(root, defaults, options);

        this.elements = this.findElements();
        this.checkItemsCount();
        this.switchTabTo(parseInt(this.data.activeTab));
        this.elements['navItems'].forEach((element, index) => {
            element.addEventListener('click', (event) => {
                event.preventDefault();
                this.switchTabTo(index);
                return false;
            });
        });
    }

    findElements() {
        let elements = {};
        this.root.querySelectorAll(this.selectors['navItems']).forEach;
        elements['navItems'] = [].slice.call(this.root.querySelectorAll(this.selectors['navItems']));
        elements['contentItems'] = [].slice.call(this.root.querySelectorAll(this.selectors['contentItems']));
        return elements;
    }

    checkItemsCount() {
        if (this.elements['navItems'].length !== this.elements['contentItems'].length)
            throw `[${this.name}] Number of navigation (${this.elements['navItems'].length}) doesn't match number of content elements (${this.elements['contentItems'].length})`;
    }

    switchTabTo(id) {
        if (id > this.elements['navItems'].length)
            throw `[${this.name}] Can't switch to tab (${id}). Total (${this.elements['navItems'].length})`;
        this.elements['navItems'].forEach((element, index) => {
            this.elements['navItems'][index].classList.remove('is-active');
            this.elements['contentItems'][index].classList.remove('is-active');
        });
        this.elements['navItems'][id].classList.add('is-active');
        this.elements['contentItems'][id].classList.add('is-active');
    }
}
