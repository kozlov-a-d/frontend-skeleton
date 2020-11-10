const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const mqpacker = require('css-mqpacker');
const sortCSSmq = require('sort-css-media-queries');

let myplugin = postcss.plugin('myplugin', function myplugin(options) {
    return function (css, result) {
        css.walkRules(function(rule) {
            // rule.selector = rule.selector + ', CARL';

            rule.walkDecls(function (decl, i) {
                if (decl.value.indexOf( '~images' ) !== -1) {
                    decl.value = decl.value.replace('~images', '../images')
                }
            });
        });
    };
});


module.exports = {
    // parser: 'sugarss',
    syntax: 'postcss-scss',
    ident: 'postcss',
    plugins:[
        // mqpacker({ sort: sortCSSmq.desktopFirst }),
        autoprefixer,
        myplugin
    ]
};