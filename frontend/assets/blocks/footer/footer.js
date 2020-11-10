import './footer.scss';

/**
 * Footer Menu
 */
export const footerMenu = (() => {
    const root = document.getElementsByClassName('js-footer-menu')[0];
    const elements = root ? Array.from(root.querySelectorAll('.-has-dropdown > a')) : [];
    const mobileView = 820;

    elements.forEach((element) => {
        element.addEventListener('click', (e) => {
            if (window.innerWidth <= mobileView) {
                e.preventDefault();
                e.target.nextElementSibling.classList.toggle('is-open');
                return false;
            }
        });
    });
})();
