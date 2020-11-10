// @ts-check

const EventEmitter = (() => {
    const events = {};

    /**
     * @public
     * @description Subscribe event, usage: menu.on('select', function(item) { ... }
     * @param {string} eventName
     * @param {Function} handler
     */
    const on = (eventName, handler) => {
        if (!events[eventName]) events[eventName] = [];
        events[eventName].push(handler);
    };

    /**
     * @public
     * @description Unsubscribe event, usage: menu.off('select', handler)
     * @param {string} eventName
     * @param {Function} handler
     */
    const off = (eventName, handler) => {
        let handlers = events && events[eventName];
        if (!handlers) return;
        for (let i = 0; i < handlers.length; i++) {
            if (handlers[i] === handler) handlers.splice(i--, 1);
        }
    };

    /**
     * @public
     * @description Trigger event with name and data, usage: this.trigger('select', data1, data2);
     * @param {*} eventName
     * @param  {...any} args
     */
    const trigger = (eventName, ...args) => {
        // обработчиков для этого события нет
        if (!events || !events[eventName]) return;
        // вызовем обработчики
        events[eventName].forEach((handler) => handler.apply(this, args));
    };

    return Object.freeze({
        on,
        off,
        trigger,
    });
})();

export default EventEmitter;
