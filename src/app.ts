import * as PIXI from 'pixi.js'

const WIDTH = 256;
const HEIGHT = 256;

class Application {
    app: PIXI.Application

    constructor(document: Document) {
        this.app = new PIXI.Application({ width: WIDTH, height: HEIGHT });
        document.body.appendChild(this.app.view);
        
    }
}

export default Application;