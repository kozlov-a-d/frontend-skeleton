const Presets = require('../presets');
const Utils = require('../utils');
const fs = require('fs');
const argv = require('yargs').argv;

const utils = new Utils();
const presets = new Presets();

let options = {
    name: argv.name
};

if (!options.name) {
    utlis.warn('Block name not found!');
    return false;
} else {
    let dir = `./frontend/assets/blocks/${options.name}`;
    if (!fs.existsSync(dir)){

        fs.mkdirSync(dir);

        fs.writeFileSync(`${dir}/${options.name}.scss`, presets.blockSCSS(options.name));
        fs.writeFileSync(`${dir}/${options.name}.js`, presets.blockJS(options.name));
        fs.writeFileSync(`${dir}/${options.name}.twig`, presets.blockTWIG(options.name));

        fs.appendFileSync('frontend/assets/scripts/homepage.js', `\nimport '~blocks/${options.name}/${options.name}';`);
        fs.appendFileSync('frontend/assets/scripts/pages.js', `\nimport '~blocks/${options.name}/${options.name}';`);

        utils.success(`Block ${options.name} created!`)
    } else {
        utils.warn(`Block ${options.name} is exists!`);
    }
}
    
