import App from '~scripts/common/app';
// import resizeComponent from '~scripts/utils/resize';
import './product-show-tabs.scss';
import Tabs from '~scripts/components/tabs';
App.initComponent('.js-product-show-tabs', (el) => {
    new Tabs(el);
});

/**
 * PRODUCTS SHOW
 */
// const $productsShowTabs = $('.product-show-tabs');
// if ($productsShowTabs.length > 0) {
//     (function productsShowTabs($root) {
//         const $self = $root;
//     })($productsShowTabs);
// }
