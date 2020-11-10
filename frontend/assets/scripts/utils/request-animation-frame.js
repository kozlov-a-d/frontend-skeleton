/**
 * Компонент обёртка для requestAnimationFrame и формирования очереди
 *
 * Example:
 * requestAnimationFrameComponent.add(functionName);
 *
 * @method {{ add }}
 */
const requestAnimationFrameComponent = (() => {
    const self = {
        callbacks: [],
        time: 0
    };

    /**
     * добавляем новый колбэк в очередь
     * @param {{callback: function, context}} callback
     */
    const add = (callback, ctx) => {
        self.callbacks.push({
            callback: callback,
            ctx: ctx
        });
    };

    function init(timestamp) {
        let deltaTime = timestamp - self.time;
        self.time = timestamp;
        self.callbacks.forEach((element) => {
            if (!element.ctx) {
                element.callback(deltaTime);
            } else {
                element.callback.apply(element.ctx, [deltaTime]);
            }
        });
        requestAnimationFrame(init);
    }

    requestAnimationFrame(init);

    // PUBLIC ==========================================================================================================
    return Object.freeze({
        add,
    });
})();

export default requestAnimationFrameComponent;
