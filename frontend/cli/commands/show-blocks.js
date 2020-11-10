const Presets = require('../presets');
const Utils = require('../utils');
const fs = require('fs');

const utils = new Utils();


let dir = `./node_modules/@darvins/frontend/blocks/`;
if (fs.existsSync(dir)){

    console.log('');
    utils.success(`Blocks list:`);
    console.log('');

    fs.readdir(dir, function(err, items) {
        for (var i=0; i<items.length; i++) {
            console.log(items[i] + ' [ yarn add-block --name=' + items[i] + ' ]');
        }
        console.log('');
    });
}
