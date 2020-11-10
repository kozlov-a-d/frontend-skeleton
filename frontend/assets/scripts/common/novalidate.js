import App from '~scripts/common/app';

App.on(App.events.ajax.html, (args) => {
    const html = args.$html.get(0) || args.html;
    if (location.search.indexOf('?novalidate') === 0 || location.search.indexOf('&novalidate') !== -1) {
        html.find('form').attr('novalidate', 'novalidate');
    }
});
