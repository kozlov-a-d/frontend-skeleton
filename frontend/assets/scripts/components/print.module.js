const printModule = (() => {
    const addHandlerClick = (btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            window.print();
            return false;
        });
    };

    return Object.freeze({
        init(selector) {
            const btn = document.querySelector(selector);
            if (btn) { addHandlerClick(btn); }
        },
    });
})();

export default printModule;
