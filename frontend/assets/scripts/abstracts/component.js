import { mergeDeep } from '~scripts/utils/common';

//@ts-check

/**
 * @typedef ComponentDefaultOptions
 * @type {object}
 * @property {string} name
 * @property {[key: string]: any} data
 * @property {[key: string]} *;
 */

export default class Component {
    /**
     * @param {HTMLElement} root
     * @param {ComponentDefaultOptions} defaults
     * @param {Object} options
     */
    constructor(root, defaults, options) {
        this.root = root;
        // Соединяем значение опций по умолчанию с переданными при инициализации
        const currentOptions = options ? mergeDeep(defaults, options) : mergeDeep(defaults, {});
        // Записываем обязательные значения
        this.name = currentOptions.name;
        this.data = currentOptions.data;
        this.selectors = currentOptions.selectors;
        // Корректируем значения this.data, при наличии data-атрибутов
        this.checkDataAttrsOptions();
    }

    checkDataAttrsOptions() {
        Object.keys(this.data).forEach((attr) => {
            if (this.root.dataset[attr] !== undefined) {
                switch (this.root.dataset[attr]) {
                    case 'true':
                        this.data[attr] = true;
                        break;
                    case 'false':
                        this.data[attr] = false;
                        break;
                    default:
                        this.data[attr] = this.root.dataset[attr];
                }
            }
        });
    }
}
