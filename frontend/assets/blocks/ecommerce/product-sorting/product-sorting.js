import './product-sorting.scss';

(() => {
    const sortingBtns = document.querySelectorAll('.js-products-sorting');
    if (!sortingBtns.length) return;
    [].forEach.call(sortingBtns, (btn) => {
        const url = btn.dataset.href ? btn.dataset.href : false;
        if (!url) return;
        btn.addEventListener('click', () => {
            window.location.href = btn.dataset.href;
        });
    });
})();
