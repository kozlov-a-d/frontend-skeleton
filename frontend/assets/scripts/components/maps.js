// // import $ from 'jquery';
import { mergeDeep } from '~scripts/utils/common';
// import loadComponent from '~scripts/utils/load-assets';

/**
 * Yandex map
 */
export default class MapYandex {
    constructor(_root, _options) {
        this.root = _root;
        this.defaults = {
            class: 'map-yandex',
        };
        this.data = {
            id: `map-yandex-${Math.round(Math.random() * 10000)}`,
            center: null,
            placemarks: [],
        };

        this.settings = mergeDeep(this.defaults, _options);

        if (typeof ymaps !== 'undefined') {
            this.init();
        } else {
            console.warn('ymaps is undefined');
        }
    }

    init() {
        this.root.classList.add(this.settings.class);
        this.root.setAttribute('id', this.data.id);
        this.parseData();
        this.createMap();
    }

    parseData() {
        // parse data-attr value
        const coords = this.root.dataset.coord ? this.root.dataset.coord.split(';') : [];
        const labels = this.root.dataset.label ? this.root.dataset.label.split(';') : [];
        const desciptions = this.root.dataset.desciption ? this.root.dataset.desciption.split(';') : [];
        this.data.center = this.root.dataset.center
            ? this.root.dataset.center.split(',').map((item) => item * 1)
            : coords[0].split(',').map((item) => item * 1);
        this.data.zoom = this.root.dataset.zoom ? this.root.dataset.zoom * 1 : 17;

        // create placemarks list
        for (let i = 0; i < coords.length; i++) {
            this.data.placemarks.push({
                coords: coords[i].split(',').map((item) => item * 1),
                label: labels[i],
                description: desciptions[i],
            });
        }
    }

    createMap() {
        const { data } = this;
        const { ymaps } = window;

        window.ymaps.ready(() => {
            const mapMain = new ymaps.Map(data.id, {
                center: data.center,
                zoom: data.zoom,
                scroll: false,
                duration: 1000,
                controls: ['zoomControl'],
                // controls: []
            });

            mapMain.behaviors.disable('scrollZoom');

            data.placemarks.forEach((mark) => {
                mapMain.geoObjects.add(
                    new ymaps.Placemark(mark.coords, {
                        iconCaption: mark.label,
                        balloonContent: mark.description,
                        // iconLayout: 'default#image',
                        // iconImageHref: '/maps/doc/jsapi/2.1/examples/images/myIcon.gif',
                        // iconImageSize: [30, 42],
                        // iconImageOffset: [-3, -42]
                    })
                );
            });
        });
    }
}
