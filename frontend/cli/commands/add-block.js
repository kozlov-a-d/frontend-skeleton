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
    let dirIn = `./frontend/assets/blocks/${options.name}`;
    let dirOut = `./node_modules/@darvins/frontend/blocks/${options.name}`;
    if (!fs.existsSync(dirIn)){

        if (fs.existsSync(dirOut)){

            fs.mkdirSync(dirIn);

            fs.readdir(dirOut, function(err, items) {
                for (var i=0; i<items.length; i++) {
                    // console.log(items[i]);
                    fs.createReadStream(dirOut + '/' + items[i]).pipe(fs.createWriteStream(dirIn + '/' + items[i]));
                }
            })

            fs.appendFileSync('frontend/assets/scripts/homepage.js', `\nimport '~blocks/${options.name}/${options.name}';`);
            fs.appendFileSync('frontend/assets/scripts/pages.js', `\nimport '~blocks/${options.name}/${options.name}';`);

        } else {
            utils.warn(`Block ${options.name} not found in npm!`);
        }
    } else {
        utils.warn(`Block ${options.name} is exists!`);
    }
}
