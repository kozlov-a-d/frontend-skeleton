import { mergeDeep } from '~scripts/utils/common';

/**
*
    <select class="js-custom-select" data-search>
        <option disabled selected>Плейсхолдер</option>
        <option>Опция 1</option>
        <option>Опция 2</option>
        <option>Опция 3</option>
    </select>
*
*/

export default class CustomSelect {
    constructor(_root, _options) {
        this.root = _root;
        this.html = {};
        this.defaults = {};

        this.settings = mergeDeep(this.defaults, _options);
        this.timer = null;

        this.init();
    }

    init() {
        const self = this;
        if (self.root.hasAttribute('data-search')) this.settings.search = true;
        self.html = this.createHtml(self.root);
        self.addEventListeners();
    }

    createHtml(el) {
        const result = {};
        const selectOptions = el.querySelectorAll('option');
        let headContent = this.settings.search
            ? '<input type="text" placeholder="' + selectOptions[el.selectedIndex].textContent + '">'
            : selectOptions[el.selectedIndex].textContent;

        result.select = el;
        result.wrapper = document.createElement('div');
        result.wrapper.classList.add('custom-select');
        result.head = '<div class="custom-select__head">' + headContent + '</div>';
        result.list = '<ul class="custom-select__list">' + this.buildOptionsList(selectOptions) + '</ul>';
        if (this.settings.search) {
            result.wrapper.classList.add('-searchable');
        }

        result.select.parentNode.insertBefore(result.wrapper, result.select);
        result.wrapper.appendChild(result.select);
        result.wrapper.insertAdjacentHTML('beforeend', result.head + result.list);
        result.head = result.wrapper.querySelector('.custom-select__head');
        result.list = result.wrapper.querySelector('.custom-select__list');
        result.listItems = result.list.children;
        if (this.settings.search) result.input = result.head.querySelector('input');

        return result;
    }

    buildOptionsList(options) {
        let items = '';

        options.forEach((el, i) => {
            // let item = document.createElement('li');
            let className = '';
            if (el.hasAttribute('disabled')) className += '-disabled';
            if (this.root.selectedIndex == i) className += ' is-active';
            let item = '<li class="' + className + '" data-index="' + i + '">' + el.textContent + '</li>';
            el.dataset.index = i;
            items += item;
        });

        return items;
    }

    openList() {
        this.html.wrapper.classList.add('is-active');
    }

    closeList() {
        this.html.wrapper.classList.remove('is-active');
    }

    search() {
        const q = new RegExp(this.html.input.value, 'ig');

        for (let i = 0; i < this.html.select.options.length; i++) {
            if (this.html.select.options.item(i).textContent.match(q)) {
                this.html.listItems.item(i).classList.remove('-hidden');
            } else {
                this.html.listItems.item(i).classList.add('-hidden');
            }
        }
    }

    replaceHeadText(text) {
        if (this.settings.search) {
            this.html.input.value = text;
        } else {
            this.html.head.textContent = text;
        }
    }

    selectCurrentItem(item) {
        //Добавляем текст из пункта в шапку
        this.replaceHeadText(item.textContent);

        //Отмечаем активный пункт, выбираем его в селекте и закрываем список
        for (let elem of this.html.listItems) {
            elem.classList.remove('is-active');
        }
        item.classList.add('is-active');
        this.html.select.querySelectorAll('option').item(item.dataset.index).selected = true;
    }

    addEventListeners() {
        //Клик по пункту внутри списка
        for (let item of this.html.listItems) {
            item.addEventListener('click', (e) => {
                this.selectCurrentItem(e.target);
                this.html.select.dispatchEvent(new Event('change'));
                this.closeList();
            });
        }

        this.html.select.addEventListener('change', (e) => {
            this.selectCurrentItem([...this.html.listItems].filter((el) => el.dataset.index == e.target.selectedIndex)[0]);
        });

        // Открываем список
        if (this.settings.search) {
            this.html.wrapper.querySelector('input').addEventListener('focus', (e) => {
                this.openList();
            });
        } else {
            this.html.head.addEventListener('click', (e) => {
                this.openList();
            });
        }

        //Закрываем список при клике вне нашего селекта
        window.addEventListener('click', (e) => {
            if (!this.html.wrapper.contains(e.target)) {
                this.closeList();
            }
        });

        //Поиск
        if (this.settings.search) {
            this.html.input.addEventListener('keyup', (e) => {
                this.search();
            });
        }
    }
}
