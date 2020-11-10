import { throttle } from './decorators';

/**
 * Компонент для отслеживания размеров при ресайзе и добавления функций по ресайзу
 *
 * Example:
resizeComponent.addMediaQuery({
    min: 0,    // начало интервала
    max: 1023, // конец интервала
    onEnter: function(){
        // функция выполнится при каждом входе в интервал
    },
    onEach: function(){
        // функция выполнится при каждом ресайзе внутри интервала
    },
    onExit: function(){
        // функция выполнится при выходе из интервала
    }
});
 * @method {{setFreezeTime, getScreenWidth, addMediaQuery, resizeForce, debug}}
 */
const resizeComponent = (() => {
    const self = {
        screenWidth: window.innerWidth,
        queries: [],
        freezeTime: 200,
    };

    /**
     * Заготовка для новых запросов, хранит настройки по умочанию, объединяется с новыми запросами
     * @type {{min: number, max: number, isEnter: boolean, onEnter: null, onEach: null}}
     */
    const defaultQuery = {
        min: 0, max: 10000, isEnter: false, onEnter: null, onFirstEnter: null, onEach: null, onExit: null,
    };

    // PRIVATE =========================================================================================================

    /**
     * установка минимального интервала между ресайзами
     * @param {*} time
     */
    const setFreezeTime = (time) => {
        if (typeof time !== 'number' && typeof time !== 'undefined') {
            console.warn(`resizeComponent: freezeTime type must be a number, now a ${typeof time}`);
        } else {
            self.freezeTime = time;
        }
    };

    /**
     * проверяем текущий размер экрана
     */
    const checkScreen = () => {
        self.screenWidth = window.innerWidth;
    };

    /**
     * выполняем медиа-запрос
     * @param {*} query
     */
    const triggerQuery = (queryObj) => {
        const query = queryObj;
        // проверяем разрешение
        if (query.min <= self.screenWidth && self.screenWidth <= query.max) {
            // onEnter
            if (typeof query.onEnter === 'function' && !query.isEnter) {
                query.onEnter();
                query.isEnter = true;
            }
            // onFirstEnter
            if (typeof query.onFirstEnter === 'function') {
                query.onFirstEnter();
                query.onFirstEnter = () => {};
            }
            // onEach
            if (typeof query.onEach === 'function') {
                query.onEach();
            }
        } else {
            if (query.isEnter) { query.onExit(); }
            query.isEnter = false;
        }
    };

    /**
     * проверяем корректность медиа-запроса
     * @param {*} query
     */
    const validateQuery = (query) => {
        const validQuery = query;
        if (typeof validQuery.min !== 'number' && typeof validQuery.min !== 'undefined') {
            console.warn(`resizeComponent: query.min type must be a number, now a ${typeof validQuery.min}`);
            validQuery.min = defaultQuery.min;
        }
        if (typeof validQuery.max !== 'number' && typeof validQuery.max !== 'undefined') {
            console.warn(`resizeComponent: query.max type must be a number, now a ${typeof validQuery.min}`);
            validQuery.max = defaultQuery.max;
        }
        if (typeof validQuery.onEnter !== 'function' && typeof validQuery.onEnter !== 'undefined') {
            console.warn(`resizeComponent: query.onEnter type must be a function, now a ${typeof validQuery.onEnter}`);
            validQuery.onEnter = null;
        }
        if (typeof validQuery.onFirstEnter !== 'function' && typeof validQuery.onFirstEnter !== 'undefined') {
            console.warn(`resizeComponent: query.onEnter type must be a function, now a ${typeof validQuery.onFirstEnter}`);
            validQuery.onFirstEnter = null;
        }
        if (typeof validQuery.onEach !== 'function' && typeof validQuery.onEach !== 'undefined') {
            console.warn(`resizeComponent: query.onEach type must be a function, now a ${typeof validQuery.onEach}`);
            validQuery.onEach = null;
        }
        if (typeof validQuery.onExit !== 'function' && typeof validQuery.onExit !== 'undefined') {
            console.warn(`resizeComponent: query.onEach type must be a function, now a ${typeof validQuery.onExit}`);
            validQuery.onExit = null;
        }
        return validQuery;
    };

    /**
     * добавляем новый медиа-запрос
     * @param {*} query
     */
    const addQuery = (query) => {
        const newQuery = validateQuery(query);
        self.queries.push(newQuery);
        triggerQuery(newQuery);
    };

    /**
     * перебираем все медиа-запросы при ресайзе, используется декоратор throttle
     */
    const onResize = throttle(() => {
        self.queries.forEach((item) => {
            triggerQuery(item);
        });
    }, self.freezeTime);


    // INIT ============================================================================================================

    // получаем текущий размер
    checkScreen();
    // навешиваем обработчик
    window.addEventListener('resize', () => {
        checkScreen();
        onResize();
    });


    // PUBLIC ==========================================================================================================
    return Object.freeze({
        /**
         * Установка минимального интервала между ресайзами
         * @param {number} time
         */
        setFreezeTime,
        /**
         * Возвращает текущий размер экрана
         * @returns {number}
         */
        getScreenWidth() {
            checkScreen();
            return self.screenWidth;
        },
        /**
         * Добавляет новый медиа-запрос
         * @param {{min: number, max: number, onEnter: function, onEach: function, onExit: function}} query
         */
        addMediaQuery: addQuery,
        /**
         * Принудительно вызывает срабатывание актуальных колбэков
         */
        resizeForce: onResize,
        /**
         * Выводит список текущих медаи-запросов
         */
        debug() {
            console.log(self.queries);
        },
    });
})();


export default resizeComponent;
