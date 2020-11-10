import $ from 'jquery';
import { mergeDeep } from '~scripts/utils/common';

export default class CustomInputNumber {
    constructor(_root, _options) {
        this.root = _root;
        this.html = {};
        this.defaults = {
            // className: '',
            minValue: 1, // минимальное допустимое значение
            maxValue: 1000, // максимально допустимое значение
            speedChange: 200, // скорость изменения значений (мс)
            stepValue: 1, // шаг значения
            modifiers: '', // дополнительный класс из дата атрибута data-mod

            /* пока не работает */
            defaultValue: 1, // значение по умолчанию, если не задано

            onChange: () => {}, // функция вполняемая после каждого изменения значения инпута
            onFinalChange: () => {}, // функция вполняемая после последнего изменения значения инпута
        };

        this.settings = mergeDeep(this.defaults, _options);
        this.timer = null;

        this.init();
    }

    init() {
        // let self = this;

        this.html = this.createHtml();
        this.checkMinMaxVal(+this.html.input.value);
        this.addEventListeners(this.html.minus, -1);
        this.addEventListeners(this.html.plus, 1);

        this.html.input.addEventListener('change', () => {
            this.checkMinMaxVal(+this.html.input.value);
            this.settings.onChange(this.html.input);
        });
    }

    createHtml() {
        const result = {};

        result.input = this.root;

        result.wrapper = document.createElement('div');
        result.wrapper.classList.add('custom-number');
        this.root.parentNode.insertBefore(result.wrapper, this.root);
        result.wrapper.appendChild(this.root);

        result.minus = document.createElement('span');
        result.minus.classList.add('custom-number__btn');
        result.minus.classList.add('-minus');
        result.wrapper.appendChild(result.minus);

        result.plus = document.createElement('span');
        result.plus.classList.add('custom-number__btn');
        result.plus.classList.add('-plus');
        result.wrapper.appendChild(result.plus);

        return result;
    }

    checkMinMaxVal(val) {
        if (val === this.settings.minValue) {
            this.html.minus.classList.add('is-disabled');
        } else if (val === this.settings.maxValue) {
            this.html.plus.classList.add('is-disabled');
        } else {
            this.html.plus.classList.remove('is-disabled');
            this.html.minus.classList.remove('is-disabled');
        }
    }

    addEventListeners(el, koef) {
        const self = this;
        const eventChange = new Event('change');
        // evt.initEvent('change', false, true);

        el.addEventListener('mousedown', () => {
            let data = self.html.input.value * 1;
            if ((koef < 0 && data > self.settings.minValue) || (koef > 0 && data < self.settings.maxValue)) {
                self.html.input.value = data + self.settings.stepValue * koef;
                self.html.input.dispatchEvent(eventChange);
                if ($) {
                    $(self.html.input).change();
                }
                data += self.settings.stepValue * koef;
            }

            self.timer = setInterval(() => {
                if ((koef < 0 && data > self.settings.minValue) || (koef > 0 && data < self.settings.maxValue)) {
                    self.html.input.value = data + self.settings.stepValue * koef;
                    self.html.input.dispatchEvent(eventChange);
                    if ($) {
                        $(self.html.input).change();
                    }
                    data = data + self.settings.stepValue + koef;
                }
            }, self.settings.speedChange);
        });

        el.addEventListener('mouseup', () => {
            clearInterval(self.timer);
            self.settings.onFinalChange();
        });

        el.addEventListener('mouseleave', () => {
            clearInterval(self.timer);
            self.settings.onFinalChange();
        });
    }
}
