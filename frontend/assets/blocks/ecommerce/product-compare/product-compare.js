// import $ from 'jquery';
// import SimpleBar from 'simplebar';
import SimpleBar from 'simplebar';
import './product-compare.scss';

const $compare = $('.js-compare');
if ($compare.length > 0) {
    ((_root) => {
        const self = {
            $sidebar: _root.find('.js-compare-sidebar'),
            $content: _root.find('.js-compare-content'),
            $items: _root.find('.js-compare-item'),
            rowSelector: '.product-compare__row',
            line: [],
        };

        function generateLines() {
            self.$sidebar.find(self.rowSelector).each((index, item) => {
                item.dataset.indexCol = 0;
                item.dataset.indexRow = index;
            });
            self.$items.each((index, item) => {
                const indexCol = index * 1 + 1;
                $(item).find(self.rowSelector).each((indexRow, itemRow) => {
                    itemRow.dataset.indexCol = indexCol;
                    itemRow.dataset.indexRow = index;
                });
            });

            $(self.rowSelector).each((index, item) => {
                const elem = item;
                if (typeof self.line[elem.dataset.indexRow] === 'undefined') {
                    self.line[elem.dataset.indexRow] = [];
                }
                self.line[elem.dataset.indexRow][elem.dataset.indexCol] = elem;
            });
        }

        function updateLineHeight() {
            self.line.forEach((element) => {
                let maxHeight = 0;

                // reset height
                element.forEach((el) => {
                    el.style.height = 'auto';
                });

                // calc max height
                element.forEach((el) => {
                    const currHeight = parseInt(getComputedStyle(el).height, 10);
                    maxHeight = (currHeight > maxHeight) ? currHeight : maxHeight;
                });

                // apply new height
                element.forEach((el) => {
                    el.style.height = `${maxHeight}px`;
                });
            });
        }

        //-------------------------------------

        generateLines();
        updateLineHeight();

        // const { SimpleBar } = window;
        const el = new SimpleBar(self.$content.get(0));
        el.recalculate();

        document.addEventListener('resize', () => {
            updateLineHeight();
        });
    })($compare);
}
