import ParallaxOnScroll from '~scripts/components/parallax-on-scroll';
import './template-parallax-scroll.scss';

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.js-parallax-on-scroll').forEach((element) => {
        new ParallaxOnScroll(element);
    });
});
