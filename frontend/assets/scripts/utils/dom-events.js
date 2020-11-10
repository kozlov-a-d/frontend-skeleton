/* eslint-disable */

/**
 * Example
 * import { animationEvent } from '../../base/dom-events';
 *
 * add listener
 * $('.modal').get(0).addEventListener(animationEvent, function () {
 *      // remove block when anomation complited
 *      $('.modal').remove();
 *      // or remove listener
 *      $('.modal').get(0).removeEventListener(animationEvent, function () {});
 * });
 * add class with animation
 * $('.modal').addClass('closing');
 *
 */
export const animationEvent = (function whichAnimationEvent(){
    let t,
        el = document.createElement("fakeelement");

    let animations = {
        "animation"      : "animationend",
        "OAnimation"     : "oAnimationEnd",
        "MozAnimation"   : "animationend",
        "WebkitAnimation": "webkitAnimationEnd"
    };

    for (t in animations){
        if (el.style[t] !== undefined){
            return animations[t];
        }
    }
})();


/**
 * Example
 * import { transitionEvent } from '../../base/dom-events';
 *
 * add listener
 * $('.modal').get(0).addEventListener(transitionEvent, function () {
 *      // remove block when anomation complited
 *      $('.modal').remove();
 *      // or remove listener
 *      $('.modal').get(0).removeEventListener(transitionEvent, function () {});
 * });
 * add class with transition
 * $('.modal').addClass('closing');
 *
 */
export const transitionEvent = (function whichAnimationEvent() {
    let t;
    const el = document.createElement('fakeelement');

    const transitions = {
        transition: 'transitionend',
        OTransition: 'oTransitionEnd',
        MozTransition: 'transitionend',
        WebkitTransition: 'webkitTransitionEnd',
    };

    Object.keys(transitions).forEach((key) => {
        if (el.style[key] !== undefined) {
            return transitions[key];
        }
    });
}());


