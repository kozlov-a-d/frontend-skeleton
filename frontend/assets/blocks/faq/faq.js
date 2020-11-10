import './faq.scss';

const faq = (() => {
    const blocks = document.getElementsByClassName('js-faq');
    if (!blocks.length) return;

    const hideAll = () => {
        [].forEach.call(blocks, (block) => {
            let content = block.getElementsByClassName('js-faq-content')[0];
            block.classList.remove('is-open');
            content.style.height = 0;
        });
    }
    [].forEach.call(blocks, (block) => {
        let btn = block.getElementsByClassName('js-faq-title')[0];
        let content = block.getElementsByClassName('js-faq-content')[0];
        
        btn.addEventListener('click', (event) => {
            event.preventDefault();

            const isCurrent = block.classList.contains('is-open');
            hideAll();

            if (!isCurrent) {
                block.classList.add('is-open');
                content.style.height = content.scrollHeight + 'px';
            } 

            return false;
        })
    });
})();
