import App from '~scripts/common/app';

/**
 * COMPONENT FOR TRACKING GOALS
 *
 * GOALS NAMING CONVENTION
 *
 * Category: 'Clicks'
 * Action: 'Click on Phone' - Клик на телефон
 * Action: 'Click on Email' - Клик на почту
 * Action: 'Click on WhatsApp' - Клик на WhatsApp
 * Action: 'Click on Telegram' - Клик на Telegram
 *
 * Category: Email
 * Action: 'Email Enquiry' - форма Book Now форму и аналогичные
 * Action: 'Email Feedback' - ФОС на странице контакты или в подвале
 * Action: 'Email Callback' - Заказ звонка
 * Action: 'Email Review' - Добавление отзыва
 * Action: 'Email Specialist' - Вызов специалиста
 * Action: 'Email Subscribe' - Подписаться на рассылку
 * Action: 'Email Career' - Отклик на вакансию
 *
 * Category: 'Ecommerce'
 * Action: 'View Product' - Просмотр продукта
 * Action: 'Add to Cart' - Добавление в корзину
 * Action: 'Remove from Cart' - Удаление из корзины
 * Action: 'Purchase' - Покупка
 * Action: 'Get Price List' - Получить прайс
 * Action: 'Enquire' - Отправить запрос
 * Action: 'Quick Order' - Заказ без корзины (купить в 1 клик)
 * Action: 'Review Product' - Отзыв к товару
 *
 *
 * USAGE EXAMPLE
 *
 * goalsModule.trigger('goalName', 'goalCategory');
 *
 * @requires jquery
 * @type {{trigger}}
 */
const goalsModule = (() => {
    // Enable/Disable tracking services
    const isMultilang = false;
    const yaID = ''; // metrika id

    const goalDone = (goalName, goalCategory) => {
        if (isMultilang) {
            if (App.lang) goalName = `${goalName} ${App.lang[0].toUpperCase() + App.lang.slice(1)}`;
            else console.warn('У тега html отсутствует атрибут lang');
        }
        if (typeof window[`yaCounter${yaID}`] !== 'undefined') window[`yaCounter${yaID}`].reachGoal(goalName, () => {});
        if (typeof ga !== 'undefined') window.ga('send', 'event', goalCategory, goalName);
        if (typeof gtag !== 'undefined') window.gtag('event', goalName, { event_category: goalCategory });
        if (typeof fbq !== 'undefined') window.fbq('track', goalName, {});
        console.log(`Goal done. name: ${goalName}, category: ${goalCategory}`);
    };

    const body = document.querySelector('body');

    body.addEventListener(
        'click',
        (event) => {
            let target = event.target;

            if (target.tagName !== 'a') {
                target = target.closest('a');
                if (target == null) return;
            }

            if (target.href.substr(0, 4) == 'tel:') goalDone('Click on Phone', 'Clicks');
            if (target.href.substr(0, 7) == 'mailto:') goalDone('Click on Email', 'Clicks');
            if (target.href.substr(0, 25) == 'https://api.whatsapp.com/') goalDone('Click on WhatsApp', 'Clicks');
            if (target.href.substr(0, 3) == 'tg:') goalDone('Click on Telegram', 'Clicks');
        },
        { passive: true }
    );

    // For our CMS
    // App.events.form.success - event of a successfull form submit
    // Form must have data-attributes with goal name and category
    // Exmaple:
    // <form data-goal-name="EmailFeedback" data-goal-category="Email" class="js-ajax" >
    App.on(App.events.form.success, (args) => {
        const { $form } = args;
        const name = $form.data('goalName') ? $form.data('goalName') : false;
        if (name) {
            const category = $form.data('goalCategory') ? $form.data('goalCategory') : 'default';
            goalsModule.trigger(name, category);
        }
    });

    return Object.freeze({
        trigger(name, params) {
            goalDone(name, params);
        },
    });
})();

export default goalsModule;
