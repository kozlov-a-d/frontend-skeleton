import ParallaxOnMouse from '~scripts/components/parallax-on-mouse';
import './template-parallax-mouse.scss';

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.js-parallax-on-mouse').forEach((element) => {
        new ParallaxOnMouse(element);
    });
});
