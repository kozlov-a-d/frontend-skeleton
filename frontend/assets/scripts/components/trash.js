export default class TrashCSS {

    constructor() {
        this.time = 0;
        this.timeUntilNext = Math.round(Math.random() * 1000);
        this.elementsAll = document.querySelectorAll('* > * > *');
        this.drawing = [];
        this.update();
    }

    addToDraw(){
        const element = this.elementsAll[Math.round(Math.random() * (this.elementsAll.length - 1))];
        // console.log(element);
        // this.drawing.push(this.transformRotate(element));
        this.drawing.push(this.filterHUERotate(element));
    }

    // transformRotate(element) {
    //     let result = {};
    //     result.element = element;
    //     result.offset = 0.1;
    //     result.callback = () => {
    //         result.offset += 0.1;
    //         result.element.style.transform = `rotate(${result.offset}deg)`;
    //     };
    //     return result;
    // }

    filterHUERotate(element) {
        let result = {};
        result.element = element;
        result.offset = 1;
        result.isEnd = false;
        result.callback = () => {
            result.offset += 1;
            result.element.style.filter = `hue-rotate(${result.offset}deg)`;
            if (result.offset == 360 ) {
                result.isEnd = true;
            }
        };
        return result;
    }

    render(deltaTime) {
        // draw state
        if ( !isNaN(deltaTime) ){
            if ( this.timeUntilNext - deltaTime <= 0 ){
                this.addToDraw();
                this.timeUntilNext = Math.round(Math.random() * 1000);
            } 
            this.timeUntilNext -= deltaTime;
        }

        this.drawing.forEach((item, index) => {
            item.callback();
            if (item.isEnd) {
                this.drawing.splice(index, 1)
            }
        })
    }

    update(time) {
        const deltaTime = time - this.time;
        this.time = time;
        this.render(deltaTime);
        requestAnimationFrame((time) => this.update(time));
    }
}
