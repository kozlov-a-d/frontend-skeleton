import App from '~scripts/common/app';
// @ts-check

/**
 * Выделяет активный пункт меню
 * Нужен для сайтов, где менюшка кэшируется без выделения текущего пункта
 * js-menu-active-class - вешаем на обертку меню
 * is-active - класс текущего пункта, вешается на li
 */
{
    /** @param {HTMLElement} element */
    function highlightParent(element) {
        const parentLi = element.closest('li');
        if (parentLi) {
            parentLi.classList.add('is-active');
            const parentUl = parentLi.closest('ul');
            if (parentUl && !parentUl.classList.contains('is-root')) highlightParent(parentUl);
        }
    }

    const init = (context) => {
        const menus = context.querySelectorAll('.js-menu-active-class');
        let currentURL = window.location.pathname;

        // если это страница умного фильтра, то убираем лишнее из урла
        if (currentURL.indexOf('/filtered/') >= 0) currentURL = currentURL.substring(0, currentURL.indexOf('/filtered/') + 1);

        menus.forEach((menu) => {
            const links = menu.querySelectorAll('a');
            links.forEach((link) => {
                if (link.getAttribute('href') === currentURL) highlightParent(link);
            });
        });
    };

    init(document);
    App.on(App.events.ajax.html, (args) => {
        const html = args.$html.get(0) || args.html;
        init(html);
    });
}
