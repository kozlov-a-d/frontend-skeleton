import { mergeDeep } from '~scripts/utils/common';

export default class CustomInputFile {
    constructor(_root, _options) {
        this.root = _root;
        this.html = {};
        this.defaults = {
            hasPreview: false,
            hasBtnClear: false,
            blockClass: 'custom-file',
            text: {
                placeholder: 'Upload Picture',
                btnClear: 'Clear',
            },
            onChange() {}, // функция вполняемая после каждого изменения значения инпута
        };

        this.settings = mergeDeep(this.defaults, _options);
        this.checkDataSetting();
        // console.log(this.settings);
        this.timer = null;

        this.init();
    }

    init() {
        const self = this;

        this.html = this.createHtml();
        this.html.input = this.root;

        // add event listener
        this.html.input.addEventListener('change', () => {
            if (this.html.input.files[0]) {
                self.html.text.innerText = this.html.input.files[0].name;
            } else {
                self.html.text.innerText = self.settings.text.placeholder;
            }

            if (this.settings.hasPreview) {
                self.updatePreview();
            }
        });

        if (this.settings.hasBtnClear) {
            // add event listener
            this.html.btnClear.addEventListener('click', (e) => {
                e.preventDefault();
                self.html.input.value = '';
                self.html.text.innerText = this.settings.text.placeholder;
                this.updatePreview();
                return false;
            });
        }
    }

    checkDataSetting() {
        this.settings.hasPreview =
            this.root.dataset.preview === 'true' ? this.root.dataset.preview === 'true' : this.settings.hasPreview;
        this.settings.hasBtnClear =
            this.root.dataset.btnClear === 'true' ? this.root.dataset.btnClear === 'true' : this.settings.btnClear;
    }

    createHtml() {
        const result = {};

        result.input = this.root;

        result.wrapper = document.createElement('div');
        result.wrapper.classList.add(this.settings.blockClass);
        this.root.parentNode.insertBefore(result.wrapper, this.root);
        result.wrapper.appendChild(this.root);

        // add preview
        if (this.settings.hasPreview) {
            result.preview = document.createElement('div');
            result.preview.classList.add(`${this.settings.blockClass}__preview`);
            result.wrapper.appendChild(result.preview);

            result.previewImg = document.createElement('img');
            result.preview.appendChild(result.previewImg);
        }

        result.text = document.createElement('div');
        result.text.classList.add(`${this.settings.blockClass}__text`);
        result.text.innerText = this.settings.text.placeholder;
        result.wrapper.appendChild(result.text);

        // add preview
        if (this.settings.hasBtnClear) {
            result.btnClear = document.createElement('button');
            result.btnClear.classList.add(`${this.settings.blockClass}__btn-clear`);
            result.btnClear.innerText = this.settings.text.btnClear;
            result.wrapper.appendChild(result.btnClear);
        }

        return result;
    }

    updatePreview() {
        const self = this;

        if (self.html.input.files && self.html.input.files[0]) {
            // if selected image
            const reader = new FileReader();
            reader.onload = (e) => {
                self.html.previewImg.setAttribute('src', e.target.result);
                self.html.preview.classList.add('is-upload');
            };
            reader.readAsDataURL(self.html.input.files[0]);
        } else {
            // if nothing
            self.html.previewImg.setAttribute('src', '');
            self.html.preview.classList.remove('is-upload');
        }
    }
}
