import $ from 'jquery';

const Tables = (() => {
    // private =============================================================
    const wrapTables = (tableSelector) => {
        $(tableSelector).each((index, element) => {
            const currTable = $(element);
            // var className = "table-responsive";
            // if(currTable.attr('data-view-type') == 'horizontal'){ className += ' -horizontal'; }
            currTable.wrap("<div class='table-responsive'><div class='table-responsive__scroll'></div></div>");
        });
    };

    // public =============================================================
    return {
        addMobileView(tableSelector) {
            wrapTables(tableSelector);
        },
    };
})();

export default Tables;
