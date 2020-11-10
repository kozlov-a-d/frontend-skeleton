var Encore = require('@symfony/webpack-encore');
var path = require('path');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const imageminMozjpeg = require('imagemin-mozjpeg');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');
const argv = require('yargs').argv;

const myPath = {
    html: {
        entry: ['./frontend/html/pages', './frontend/html/modals'],
        resolve: 'frontend/html/**/',
    },
    dist: './public',
};

const options = {
    isHTML: argv.html === 'true',
    isImages: argv.img === 'true',
    isImagesOptimize: argv.img === 'prod',
    isServer: argv.server === 'true',
};

Encore.setOutputPath(!Encore.isProduction() ? 'public/assets/build-dev' : 'public/assets/build')
    .setPublicPath(!Encore.isProduction() ? '/assets/build-dev' : '/assets/build')
    .enableVersioning(Encore.isProduction())
    .addEntry('homepage', './frontend/assets/scripts/homepage.js')
    .addEntry('pages', './frontend/assets/scripts/pages.js')
    .disableSingleRuntimeChunk()
    .addAliases({
        '~blocks': path.resolve(__dirname, `frontend/assets/blocks/`),
        '~styles': path.resolve(__dirname, `frontend/assets/styles/`),
        '~scripts': path.resolve(__dirname, `frontend/assets/scripts/`),
        '~vendor': path.resolve(__dirname, `frontend/assets/vendor/`),
        '~images': path.resolve(__dirname, `frontend/assets/images/`),
    })
    // .enableSourceMaps(!Encore.isProduction())
    .configureCssLoader(function (cfg) {
        cfg.url = false;
    })
    .enablePostCssLoader((options) => {
        options.config = {
            path: './',
        };
    })
    .enableSassLoader()
    .autoProvidejQuery()
    // .enableVueLoader()
    .copyFiles(
        options.isImages
            ? [
                  { from: './frontend/assets/images', to: '../images/[path][name].[ext]' },
                  { from: './frontend/assets/fonts', to: '../fonts/[path][name].[ext]' },
              ]
            : [{ from: './frontend/assets/fonts', to: '../fonts/[path][name].[ext]' }]
    );

if (options.isServer) {
    Encore.addPlugin(
        new BrowserSyncPlugin({
            host: 'localhost',
            port: 3000,
            server: { baseDir: [myPath.dist] },
        })
    );
}

if (options.isImagesOptimize) {
    Encore.addPlugin(
        new ImageminPlugin({
            test: /\.(jpe?g|png|gif|svg)$/i,
            optipng: {
                optimizationLevel: 3,
            },
            plugins: [imageminMozjpeg({ quality: 90, progressive: true })],
        })
    );
}

var config;

if (options.isHTML) {
    Encore.addLoader({
        test: /\.twig$/,
        use: ['twig-loader'],
    });
    Encore.addLoader({
        test: /\.html$/,
        include: path.resolve(__dirname, myPath.html.resolve),
        use: ['raw-loader'],
    });

    config = Encore.getWebpackConfig();

    function generateHtmlPlugins(templateDir) {
        const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
        return templateFiles
            .filter((item) => item.split('.')[0][0] !== '_')
            .map((item) => {
                const parts = item.split('.');
                const name = parts[0];
                const extension = parts[1];
                return new HtmlWebpackPlugin({
                    filename: `../../${name}.html`,
                    template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
                    inject: false,
                });
            });
    }

    const htmlPlugins = (() => {
        let results = [];
        myPath.html.entry.forEach((item) => {
            results = results.concat(generateHtmlPlugins(item));
        });
        return results;
    })();

    config.plugins = config.plugins.concat(htmlPlugins);
} else {
    config = Encore.getWebpackConfig();
}

// config.optimization = {
//     ...config.optimization,
//     splitChunks: {
//         name: 'common',
//         chunks: 'initial',
//     },
// };
config.stats = 'none';

module.exports = config;
