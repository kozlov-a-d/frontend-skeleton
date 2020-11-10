/**
 * Debouncing
 * Декоратор позволяет превратить несколько вызовов функции в течение определенного времени в один вызов,
 * причем задержка начинает заново отсчитываться с каждой новой попыткой вызова.
 * Возможно два варианта:
 * - Реальный вызов происходит только в случае, если с момента последней попытки прошло время,
 *   большее или равное задержке.
 * - Реальный вызов происходит сразу, а все остальные попытки вызова игнорируются, пока не пройдет время,
 *   большее или равное задержке, отсчитанной от времени последней попытки.
 * @param {function} func callback функция
 * @param {number} wait время задержики в миллисекундах
 * @param {boolean} immediate выполнить первый раз немедленно
 * @returns {function}
 */
export const debounce = (func, wait, immediate) => {
    var timeout;
    return function () {
        var context = this,
            args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

/**
 * Throttling
 * Данный декоратор позволяет «затормозить» функцию — функция будет выполняться не чаще одного раза в указанный период,
 * даже если она будет вызвана много раз в течение этого периода.
 * Т.е. все промежуточные вызовы будут игнорироваться.
 * @param {function} func callback функция
 * @param {number} ms время задержики
 * @returns {function}
 */
export const throttle = (func, ms) => {
    let isThrottled = false;
    let savedArgs;
    let savedThis;

    function wrapper() {
        if (isThrottled) {
            savedArgs = arguments;
            savedThis = this;
            return;
        }

        func.apply(this, arguments);

        isThrottled = true;

        setTimeout(() => {
            isThrottled = false;
            if (savedArgs) {
                wrapper.apply(savedThis, savedArgs);
                savedArgs = savedThis = null;
            }
        }, ms);
    }

    return wrapper;
};
