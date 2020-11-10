export default class ImagesZoomPopup {
    constructor(link){
        this.config = {
            cssBlockClass: 'images-zoom-popup',
            cssZIndex: 1000,
        }
        this.link = link;
        this.imagePreview = {
            element: link.getElementsByTagName('img')[0],
            url: '',
            size: {},
            coord: {},
        }
        this.imageOriginal = {
            element: false,
            url: this.link.getAttribute('href'),
            size: {},
            isLoad: false
        }
        this.wrapper = document.createElement('div');

        this.calculateImagePreviewSize();
        this.calculateImagePreviewCoords();
        this.addEventsHandler();
    }

    addEventsHandler() {
        this.link.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            
            this.imageOriginal.element = !this.imageOriginal.isLoad 
                ? this.imageLoad(this.imageOriginal.url) 
                : this.imageOriginal.element;
            
            // console.log(this.imageOriginal.element, this.imagePreview.coord);
            // console.log('imageOriginal.size', this.imageOriginal.size);
            this.appendOriginalImage();
            return false;
        });
    }

    imageLoad(url) {
        let self = this;
        let image = new Image();
        image.onload = function () {
            self.imageOriginal.element = image;
            self.imageOriginal.size.width = this.clientWidth;
            self.imageOriginal.size.height = this.clientHeight;

            self.imageOriginal.element.style.display = 'block'; 
            self.imageOriginal.element.style.position = 'absolute';
            self.imageOriginal.element.style.left = 0,
            self.imageOriginal.element.style.top = 0,
            self.imageOriginal.element.style.width = '100%'; 
            self.imageOriginal.element.style.height = '100%'; 

            self.wrapper.style.width = self.imageOriginal.size.width + 'px';
            self.wrapper.style.height = self.imageOriginal.size.height + 'px';
        }
        image.src = url;
        return image;
    }

    calculateImagePreviewSize(){
        const img = this.imagePreview.element.getBoundingClientRect();
        this.imagePreview.size.width = img.clientWidth;
        this.imagePreview.size.height = img.clientHeight;
    }

    calculateImagePreviewCoords(){
        const img = this.imagePreview.element.getBoundingClientRect();
        this.imagePreview.coord.top = img.top + pageYOffset;
        this.imagePreview.coord.left = img.left + pageXOffset;
    }

    appendOriginalImage() {
        let root = this.wrapper;
        let img = this.imageOriginal.element;

        root.style.position = 'absolute';
        root.style.left = this.imagePreview.coord.left + 'px';
        root.style.top = this.imagePreview.coord.top + 'px';
        root.style.zIndex = this.config.cssZIndex;

        root.style.width = self.imagePreview.size.width + 'px';
        root.style.height = self.imagePreview.size.height + 'px';

        root.classList.add(this.config.cssBlockClass);
        root.appendChild(img);
        document.getElementsByTagName('body')[0].appendChild(root);
    }
    
}