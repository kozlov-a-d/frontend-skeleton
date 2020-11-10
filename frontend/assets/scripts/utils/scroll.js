/**
 * Компонент для работы со скролом
 * @method {{ current, direction, enable, disable, moveTo }}
 */
const scrollComponent = (() => {
    const self = {
        elsTransform: document.querySelectorAll('.l-wrapper, .l-footer'),
        current: 0,
        previous: 0,
        backup: 0,
        direction: null,
    };

    // =================================================================================================================

    const checkScrollValue = () => {
        self.previous = self.current;
        self.current = window.pageYOffset;
        self.direction = (self.current >= self.previous) ? 'down' : 'up';
    };

    const scrollJumpTo = (position) => {
        window.scrollTo(0, position);
    };

    const saveCurrentScrollValue = () => {
        self.backup = window.pageYOffset;
    };

    // =================================================================================================================

    /**
     * animate scroll to new position
     * @param {number} - new scroll position
     * @param {number} - time
     */
    const scrollMoveTo = (positionTo) => { 
        const speed = 5000;
        const coordY = positionTo - scrollComponent.current();
        const fps = 60;
        const framesCount = Math.abs((coordY / speed) * fps);
        
        let scroller = setInterval(function() {
            let scrollBy = coordY / framesCount;
            if( Math.abs(scrollComponent.current() + scrollBy ) < Math.abs(positionTo - scrollComponent.current())) {
                window.scrollBy(0, scrollBy);
            } else {
                window.scrollTo(0, positionTo);
                checkScrollValue();
                clearInterval(scroller);
            }
        }, 1000/fps);
    };

    /**
     * enable scroll
     */
    const enableScroll = () => {
        self.elsTransform.forEach((item) => {
            item.style.transform = 'none';
        });
        document.body.style.overflowY = '';
        document.body.style.position = '';
        scrollJumpTo(self.backup);
    };

    /**
     * disable scroll
     */
    const disableScroll = () => {
        saveCurrentScrollValue();
        self.elsTransform.forEach((item) => {
            item.style.transform = `translateY(${-self.backup}px)`;
        });
        document.body.style.overflowY = 'hidden';
        document.body.style.position = 'fixed';
    };

    /**
     * get current scroll value
     * @returns {number} current value
     */
    const getCurrentScrollValue = () => self.current;

    /**
     * get current scroll direction
     * @returns {*} 'down'|'up'
     */
    const getCurrentScrollDirection = () => self.direction;


    // =================================================================================================================

    checkScrollValue();
    window.addEventListener('scroll', checkScrollValue);

    // =================================================================================================================

    return Object.freeze({
        current: getCurrentScrollValue,
        direction: getCurrentScrollDirection,
        enable: enableScroll,
        disable: disableScroll,
        moveTo: scrollMoveTo,
    });
})();


export default scrollComponent;
