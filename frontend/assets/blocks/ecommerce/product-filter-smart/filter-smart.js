// @ts-check
import App from '~scripts/common/app';
import { mergeDeep } from '~scripts/utils/common';

export default class FilterSmart {
    /**
     * @param {HTMLElement} root
     * @param {Object} settings
     */
    constructor(root, settings) {
        this.root = root;
        this.options = mergeDeep(
            {
                selectors: {
                    prop: '.js-filter-smart-prop',
                    selected: '.js-filter-smart-selected',
                    value: '.js-filter-smart-value',
                    params: '.js-filter-smart-params',
                    btn: '.js-filter-smart-btn-apply',
                    updated: '.l-main',
                },
                paramsKeep: ['sort', 'direction'],
                translate: {
                    selected: 'Выбрано',
                    outOf: 'из',
                },
            },
            settings
        );
        this.data = this.parseData();
        this.addHandler();
        // this.updateSelectedText();
    }

    /* DATA */

    parseData() {
        let data = {};

        this.root.querySelectorAll(this.options.selectors.prop).forEach((prop) => {
            const propSlug = prop.dataset.slug;
            data[propSlug] = {};
            data[propSlug].expanded = prop.dataset.expanded;
            data[propSlug].multiple = prop.dataset.multiple == 'true';
            data[propSlug].placeholder = prop.dataset.placeholder ? prop.dataset.placeholder : 'some..';
            data[propSlug].values = {};

            let values = {};
            prop.querySelectorAll(this.options.selectors.value).forEach((value) => {
                const valueSlug = value.dataset.slug;
                values[valueSlug] = {
                    checked: value.dataset.checked == 'true',
                    label: value.dataset.label,
                    element: value,
                };
            });
            data[propSlug].values = sortObject(values);
        });

        data = sortObject(data);

        return data;
    }

    setChecked(propSlug, valueSlug, value) {
        this.data[propSlug].values[valueSlug].checked = value;
        this.data[propSlug].values[valueSlug].element.dataset.checked = value;
        this.changeSelectedTextByProp(propSlug);
    }

    getChecked(propSlug, valueSlug) {
        return this.data[propSlug].values[valueSlug].checked;
    }

    // /* HANDLERS */

    addHandler() {
        this.addHandlerSelectedClose();
        this.addHandlerSubmitBtn();
        this.root.querySelectorAll(this.options.selectors.prop).forEach((prop) => {
            this.addHandlerValueOnClick(prop);
            this.addHandlerSelectedOnClick(prop);
            this.addHandlerClearSelected(prop);
        });
    }

    addHandlerValueOnClick(prop) {
        const propSlug = prop.dataset.slug;

        prop.querySelectorAll(this.options.selectors.value).forEach((value) => {
            value.addEventListener('click', (event) => {
                event.preventDefault();

                const valueSlug = value.dataset.slug;
                let newValue;

                if (this.data[propSlug].multiple) {
                    newValue = value.dataset.checked != 'true';
                } else {
                    if (value.dataset.checked == 'true') {
                        newValue = false;
                    } else {
                        this.uncheckValuesByProp(propSlug);
                        newValue = true;
                    }
                }

                this.setChecked(propSlug, valueSlug, newValue);

                return false;
            });
        });
    }

    addHandlerSelectedOnClick(prop) {
        const selected = prop.querySelector(this.options.selectors.selected);
        if (!selected) return;
        selected.addEventListener('click', (event) => {
            event.preventDefault();
            setTimeout(() => {
                selected.classList.add('is-open');
            });
            return false;
        });
    }

    addHandlerClearSelected(prop) {
        prop.addEventListener('click', (event) => {
            const target = event.target;
            if (target.classList.contains('js-filter-smart-clear')) {
                event.preventDefault();
                const propSlug = target.closest('.js-filter-smart-prop').dataset.slug;
                const valueSlug = target.dataset.slug;
                this.setChecked(propSlug, valueSlug, false);
            }
        });
    }

    addHandlerSelectedClose() {
        document.addEventListener('click', (event) => {
            /** @type {HTMLElement} */ const target = event.target;
            const parent = target.closest('.filter-smart-prop');
            if (!parent) this.closeAllSelect();
            if (parent && !parent.querySelector('.is-open')) this.closeAllSelect();
        });
        this.root.querySelectorAll(this.options.selectors.prop).forEach((prop) => {
            prop.addEventListener('mouseleave', () => {
                this.closeAllSelect();
            });
        });
    }

    addHandlerSubmitBtn() {
        this.root.querySelector(this.options.selectors.btn).addEventListener('click', (e) => {
            e.preventDefault();

            App.addFullscreenPreloader();
            const url = this.generateAction();
            fetch(url)
                .then((response) => {
                    if (response.status != 200) throw `${response.status} ${response.statusText}`;
                    return response.text();
                })
                .then((body) => {
                    this.onFiltered(body);
                })
                .catch((e) => {
                    console.error(e);
                })
                .finally(() => {
                    App.removeFullscreenPreloader();
                });

            history.pushState(null, null, url);

            return false;
        });
    }

    onFiltered(body) {
        const main = document.querySelector('.l-main');
        main.innerHTML = $(body).find('.l-main').html();
        App.trigger(App.events.ajax.html, {
            $html: $('.l-main'),
        });
        spoilerElements();
        console.warn('TODO: доделать вставку без jquery');
    }

    // /* METHODS */

    updateSelectedText() {
        for (let keyProp in this.data) {
            this.changeSelectedTextByProp(keyProp);
        }
    }

    changeSelectedTextByProp(propSlug) {
        const selected = this.root.querySelector(`[data-slug="${propSlug}"] ${this.options.selectors.selected}`);
        if (!selected) return;

        let placeholder = this.data[propSlug].placeholder;
        let text = [];
        let countOfSelected = 0;
        let countSummary = 0;
        for (let keyValues in this.data[propSlug].values) {
            countSummary++;
            if (this.data[propSlug].values[keyValues].checked) {
                text.push(keyValues);
                countOfSelected++;
            }
        }

        selected.innerHTML = this.generateSelectedTextContent(propSlug, text, countOfSelected, countSummary, placeholder);
        if (this.data[propSlug].multiple) this.updateSelectedTextView(selected);
    }

    generateSelectedTextContent(propSlug, text, countOfSelected, countSummary, placeholder) {
        let html;
        if (text.length) {
            html = '<ul class="filter-smart-prop__selected-list">';
            text.forEach((str) => {
                html += `<li>${this.data[propSlug].values[str].label}<button class="js-filter-smart-clear" data-prop="${propSlug}" data-slug="${str}">	&#10060;</button></li>`;
            });
            html += '</ul>';

            if (this.data[propSlug].multiple) {
                html += `<ul class="filter-smart-prop__selected-summary"><li>${this.options.translate.selected} ${countOfSelected} ${this.options.translate.outOf} ${countSummary}</li></ul>`;
            }
        } else {
            html = `<ul><li>${placeholder}</li></ul>`;
        }
        return html;
    }

    updateSelectedTextView(selected) {
        const selectedList = selected.querySelectorAll('.filter-smart-prop__selected-list li');
        const listWidth = selected.clientWidth;
        let listWidthSummary = 0;
        selectedList.forEach((listItem) => {
            listWidthSummary += listItem.clientWidth;
        });
        if (listWidthSummary > listWidth) selected.classList.add('is-summary');
        else selected.classList.remove('is-summary');
    }

    closeAllSelect() {
        this.root.querySelectorAll(this.options.selectors.selected).forEach((selected) => {
            selected.classList.remove('is-open');
        });
    }

    uncheckValuesByProp(propSlug) {
        for (let keyValue in this.data[propSlug].values) {
            this.data[propSlug].values[keyValue].checked = false;
            /** @type {HTMLElement} */
            const elementValue = this.root.querySelector(
                `[data-slug="${propSlug}"] ${this.options.selectors.value}[data-slug="${keyValue}"]`
            );
            elementValue.dataset.checked = 'false';
        }
    }

    generateAction() {
        let action = '';
        for (let keyProp in this.data) {
            let values = [];
            for (let keyValue in this.data[keyProp].values) {
                if (this.data[keyProp].values[keyValue].checked) values.push(keyValue);
            }
            if (values.length) action += keyProp + '_' + values.reduce((acc, value) => acc + '_' + value) + `/`;
        }

        action = action.replace('//', '/');
        action = action.replace('#', '');
        if (action.length) action = this.generateBaseUrl() + '/filtered/' + action;
        else action = this.generateBaseUrl() + '/';
        if (serializeObjectToGetParams(this.generateGetParams()))
            action += '?' + serializeObjectToGetParams(this.generateGetParams());
        if (action.charAt(action.length - 1) === '?') action = action.substr(0, action.length - 1);

        return action;
    }

    generateBaseUrl() {
        let baseLink;
        let currLink = window.location.href;

        let hasFiltered = currLink.indexOf('/filtered');
        baseLink = hasFiltered > 0 ? currLink.slice(0, hasFiltered) : currLink;

        let hasGetParams = currLink.indexOf('/?');
        baseLink = hasGetParams > 0 ? baseLink.slice(0, hasGetParams) : baseLink;

        if (baseLink.slice(-1) == '/') baseLink = baseLink.slice(0, -1);

        return baseLink;
    }

    generateGetParams() {
        const params = {};
        const paramsCurr = parseGetParamsFromUrl();
        for (let keyValue in paramsCurr) {
            if (this.options.paramsKeep.includes(keyValue)) params[keyValue] = paramsCurr[keyValue];
        }
        const paramsFilter = parseGetParamsFromForm(this.root, this.options.selectors.params);
        return mergeDeep(params, paramsFilter);
    }
}

const sortObject = (object) => {
    var newObject = {};
    Object.keys(object)
        .sort()
        .forEach(function (name) {
            newObject[name] = object[name];
        });
    return newObject;
};

/**
 * @returns {Object} get params from url
 */
const parseGetParamsFromUrl = () => {
    const hashes = window.location.search.slice(window.location.search.indexOf('?') + 1).split('&');
    const params = {};
    hashes.map((hash) => {
        const [key, val] = hash.split('=');
        params[key] = decodeURIComponent(val);
    });
    return params;
};

/**
 * @param {HTMLElement} form
 * @param {string} selectors
 * @returns {Object<[key], string>} get params from form
 */
const parseGetParamsFromForm = (form, selectors) => {
    const params = {};
    /** @type {NodeListOf<HTMLInputElement>} */
    const inputs = form.querySelectorAll(selectors);
    inputs.forEach((input) => {
        params[input.getAttribute('name')] = input.value;
    });
    return params;
};

/**
 * @param {Object} paramsObj
 * @returns {string} paramsStr
 */
const serializeObjectToGetParams = (paramsObj) => {
    let paramsStr = '';
    for (var key in paramsObj) {
        if (paramsStr != '') paramsStr += '&';
        paramsStr += key + '=' + encodeURIComponent(paramsObj[key]);
    }
    return paramsStr;
};
