/**
 * Компонент для работы с localStorage
 *
 * Example:
 * localStorageComponent.state('fieldName', 'value');  // set value for fieldName
 * localStorageComponent.state('fieldName'); // return value of fieldName
 *
 * @type {{state, remove, exist}}
 */

const localStorageComponent = (() => {
    // PRIVATE =========================================================================================================

    const setItem = (name, value) => {
        if (typeof value === 'object') {
            localStorage.setItem(name, JSON.stringify(value));
        } else {
            localStorage.setItem(name, value);
        }
    };

    const getItem = (name) => {
        const value = localStorage.getItem(name);
        let result;
        try {
            result = JSON.parse(value);
        } catch (e) {
            return value;
        }
        return result;
    };

    const removeItem = (name) => {
        localStorage.removeItem(name);
    };

    const existItem = (name) => {
        const value = getItem(name);
        let result = false;
        if (value !== null && typeof value !== 'undefined') {
            result = true;
        }
        return result;
    };

    // PUBLIC ==========================================================================================================

    return Object.freeze({
        /**
         * Добавляем или получаем значение из LocalStorage
         * @param {string} name название объекта
         * @param {string|number|json|array|*} value новое значение, если пустое - фукнция возвращает текущее
         */
        state(name, value) {
            if (typeof value !== 'undefined') {
                setItem(name, value);
            } else {
                return getItem(name);
            }
        },
        /**
         * Удаляет значение из LocalStorage с заданным именем
         * @param {string} name
         */
        remove(name) {
            removeItem(name);
        },
        /**
         * Проверка существования значения в LocalStorage с заданным именем
         * @param {string} name
         */
        exist(name) {
            return existItem(name);
        },
    });
})();

export default localStorageComponent;
