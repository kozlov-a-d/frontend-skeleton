/**
 * Get element position relative to page
 * @param {HTMLElement} element
 * @returns {Object} position left and top
 */
export function getElementCoords(element) {
    const box = element.getBoundingClientRect();
    return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset,
    };
}

/**
 * Convert string to HTML
 * @param {string} htmlString
 */
export function toHTML(htmlString) {
    const htmlObject = document.createElement('div');
    htmlObject.innerHTML = htmlString;
    return htmlObject.firstElementChild;
}

/**
 * Wrap element
 * @param {*} el element that will be wrapped
 * @param {*} wrapper wrapper container
 */
export function wrap(el, wrapper) {
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
}

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
export function mergeDeep(target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) {
                    Object.assign(target, {
                        [key]: {},
                    });
                }
                mergeDeep(target[key], source[key]);
            } else {
                Object.assign(target, {
                    [key]: source[key],
                });
            }
        }
    }

    return mergeDeep(target, ...sources);
}
