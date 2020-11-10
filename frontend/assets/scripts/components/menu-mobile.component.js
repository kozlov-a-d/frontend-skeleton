import { animationEvent } from '~scripts/utils/dom-events';
import scrollComponent from '~scripts/utils/scroll';
import { mergeDeep } from '~scripts/utils/common';

/**
 * MenuMobile
 *
 * Example html
<nav class="js-menu-mobile">
    <button data-menu-mobile--switcher-btn><span>menu</span></button>
    <ul class="is-root" data-menu-mobile--root>
        <li class="-has-dropdown">
            <a>Пунк 1</a>
            <div>
                <ul>
                    <li><a>Пунк 1.1</a></li>
                    <li><a>Пунк 1.2</a></li>
                    <li><a>Пунк 1.3</a></li>
                    <li><a>Пунк 1.4</a></li>
                    <li><a>Пунк 1.5</a></li>
                </ul>
            </div>
        </li>
        <li><a>Пунк 2</a></li>
        <li><a>Пунк 3</a></li>
        <li><a>Пунк 4</a></li>
        <li><a>Пунк 5</a></li>
        <li><a>Пунк 6</a></li>
    </ul>
</nav>
 */

const MenuMobileRender = (_id, _tree) => {
    const id = _id;
    const tree = _tree;
    let activeNode = 0;
    const html = {
        root: null,
        header: null,
        titleBtn: null,
        closeBtn: null,
        list: null,
        listItem: [],
    };

    const renderHeader = () => {
        html.header = document.createElement('div');
        html.header.classList.add('menu-mobile__header');
        html.root.appendChild(html.header);

        const titleWrap = document.createElement('div');
        titleWrap.classList.add('menu-mobile__title');
        html.header.appendChild(titleWrap);

        html.titleBtn = document.createElement('button');
        html.titleBtn.classList.add('menu-mobile__title-btn');
        titleWrap.appendChild(html.titleBtn);

        html.closeBtn = document.createElement('button');
        html.closeBtn.classList.add('menu-mobile__close-btn');
        html.closeBtn.innerHTML = '<span></span>';
        html.header.appendChild(html.closeBtn);
    };

    const updateHeader = () => {
        html.titleBtn.innerHTML = `<i class="menu-mobile__icon-arrow-right"></i>${tree[activeNode].name}`;
        html.titleBtn.dataset.node = activeNode;
    };

    const renderList = () => {
        html.list = document.createElement('ul');
        html.list.classList.add('menu-mobile__list');
        html.root.appendChild(html.list);
    };

    const updateList = () => {
        html.list.innerHTML = '';

        for (let i = 0; i < tree.length; i++) {
            if (tree[i].parentId === parseInt(activeNode, 10)) {
                const item = html.listItem[i];
                html.list.appendChild(item);
            }
        }

        html.list.childNodes.forEach((element) => {
            element.addEventListener(animationEvent, () => {
                element.classList.remove('menu-mobile-item-show-enter-active');
                element.removeEventListener(animationEvent, () => {});
            });
            element.classList.add('menu-mobile-item-show-enter-active');
        });
    };

    const updateActiveNode = (_activeNodeId) => {
        activeNode = _activeNodeId;
        updateHeader();
        updateList();
    };

    const generateList = () => {
        for (let i = 0; i < tree.length; i++) {
            const item = document.createElement('li');
            item.classList.add('menu-mobile__item');

            const link = document.createElement('a');
            link.classList.add('menu-mobile__item-name');
            link.innerText = tree[i].name.replace(/\r?\n/g, '');
            link.href = tree[i].href;
            item.appendChild(link);

            const btn = document.createElement('button');
            btn.classList.add('menu-mobile__item-btn');
            if (tree[i].hasChild) {
                btn.classList.add('hasChild');
                btn.innerHTML = '<i class="menu-mobile__icon-more"></i>';
                btn.dataset.id = i;
                btn.addEventListener('click', (e) => {
                    updateActiveNode(e.target.dataset.id);
                });
            } else {
                btn.innerHTML = '<i class="menu-mobile__icon-arrow-left"></i>';
            }
            item.appendChild(btn);

            html.listItem.push(item);
        }
    };

    const close = () => {
        if (typeof scrollComponent !== 'undefined') {
            scrollComponent.enable();
        }
        html.root.classList.add('is-closing', 'menu-mobile-toggle-leave-active');
        activeNode = 0;
    };

    const open = () => {
        if (typeof scrollComponent !== 'undefined') {
            scrollComponent.disable();
        }
        updateActiveNode(0);
        html.root.classList.remove('is-closed');
        html.root.classList.add('is-opening', 'menu-mobile-toggle-enter-active');
    };

    const addToggleAnimateHandler = () => {
        html.root.addEventListener(animationEvent, () => {
            if (html.root.classList.contains('is-opening')) {
                html.root.classList.remove('is-opening', 'menu-mobile-toggle-enter-active');
            }
            if (html.root.classList.contains('is-closing')) {
                html.root.classList.add('is-closed');
                html.root.classList.remove('is-closing', 'menu-mobile-toggle-leave-active');
            }
            html.root.removeEventListener(animationEvent, () => {});
        });
    };

    const addHandler = () => {
        html.closeBtn.addEventListener('click', () => {
            close();
        });

        html.titleBtn.addEventListener('click', () => {
            if (activeNode === 0) {
                close();
            } else {
                updateActiveNode((activeNode = tree[activeNode].parentId || 0));
            }
        });
    };

    const render = () => {
        html.root = document.createElement('div');
        html.root.classList.add('menu-mobile');
        html.root.id = `menu-mobile-${id}`;
        html.root.classList.add('is-closed');
        document.body.appendChild(html.root);

        addToggleAnimateHandler();
        renderHeader();
        generateList();
        renderList();
    };

    return Object.freeze({
        init() {
            render();
            addHandler();
        },
        open,
        close,
    });
};

export default class MenuMobile {
    constructor(_root, _options) {
        this.root = _root;
        this.defaults = {
            text: {
                rootTitle: 'Menu',
            },
            selectors: {
                nodeRoot: '.is-root',
                nodeLink: 'a, span',
                node: '-has-dropdown',
                btnToggle: '[data-menu-mobile--switcher-btn]',
            },
        };
        this.settings = mergeDeep(this.defaults, _options);

        this.init();
    }

    init() {
        const id = Math.round(Math.random() * 10000);
        const tree = this.buildMenuTree();
        // console.log(tree);
        this.renderMenu(id, tree);
        // handlers
        this.addHandlerToggleBtn(this, this.root, this.settings.selectors.btnToggle, this.settings.VM);
    }

    buildMenuTree() {
        const nodeRoot = this.root.getElementsByClassName('main-menu__root')[0];
        const { rootTitle } = this.settings.text;
        const { nodeLink } = this.settings.selectors;
        const { node } = this.settings.selectors;

        const tree = [];
        let _id = 0;

        // задаём корень
        tree.push({
            id: _id,
            name: rootTitle,
            elementLink: nodeRoot,
            hasChild: true,
            parentId: null,
        });
        // рекурсивно строим остальное дерево
        function build(parentNode) {
            const parent = parentNode.elementLink;
            const el = [...parent.children];

            el.forEach((item) => {
                _id++;
                const element = item.querySelector(nodeLink);
                const currNode = {
                    id: _id,
                    name: element.textContent,
                    href: element.getAttribute('href'),
                    elementLink: item.getElementsByTagName('ul')[0],
                    hasChild: item.classList.contains(node),
                    parentId: parentNode.id,
                };

                tree.push(currNode);
                if (currNode.hasChild) {
                    build(currNode);
                }
            });
        }
        build(this.getNodeRoot(tree));
        return tree;
    }

    /**
     * Получения узла по ID
     * @param {*} id
     * @param {*} tree
     */
    getNodeById(id, tree) {
        let result = null;
        // ищем элемент с заданным id
        tree.forEach((item) => {
            if (item.id === id) {
                result = item;
                return false;
            }
        });
        // если элемента с таким id нет, то возвращаем null
        return result;
    }

    /**
     * Получения корня
     * @param {*} tree
     */
    getNodeRoot(tree) {
        return this.getNodeById(0, tree);
    }

    renderMenu(_id, _tree) {
        this.settings.VM = MenuMobileRender(_id, _tree);
        this.settings.VM.init();
    }

    addHandlerToggleBtn(self, container, selector, VM) {
        container.querySelectorAll(selector).forEach((item) => {
            item.addEventListener('click', () => {
                self.showMenu(VM);
            });
        });
    }

    showMenu(VM) {
        VM.open();
    }

    hideMenu(VM) {
        VM.close();
    }
}
