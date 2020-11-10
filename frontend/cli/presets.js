function blockSCSS (blockname) {
    return `@import "~styles/variables.scss";
    // @import "~styles/layout/common.scss";
    // @import "~styles/mixins/grid-mixins.scss";
    // @import "~styles/mixins/utitlties.scss";
    // @import "~styles/common/buttons.scss";
    
    .${blockname}{
        // styles here
    }`;
};


function blockTWIG (blockname) {
    return `{# {% include '../../assets/blocks/${blockname}/${blockname}.twig' %} #}
    
    <!-- .${blockname} -->
    <div class="${blockname}">
        <!-- code here -->
    </div><!-- end .${blockname}-->`;
}

function blockJS (blockname) {
    return `import './${blockname}.scss';`;
}


let Presets = function(){
    this.blockSCSS = blockSCSS;
    this.blockTWIG = blockTWIG;
    this.blockJS = blockJS;
};

module.exports = Presets;
