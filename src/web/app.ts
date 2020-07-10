import Intro from './intro/intro';
import GameState from './gamestate';
import Game from './game/game';
import Context from './context';

enum Stage {
    Intro,
    Game,   
};

class Application {
    private app : PIXI.Application;
    private stage : Stage;
    private introScreen : Intro;
    private gameScreen :  Game;
    private state : GameState;

    constructor(document: HTMLDocument) {
        this.app = new PIXI.Application({ 
            width: window.innerWidth, 
            height: window.innerHeight,
            resolution: 1,
            backgroundColor: 0xFFFFFF,
        });


        document.body.appendChild(this.app.view);

        this.state = new GameState(this);
        this.stage = Stage.Intro;

        this.app.ticker.add((delta) => this.loop(delta))

        this.introScreen = new Intro(this.state);

        this.app.stage.addChild(this.introScreen.sprite);

        Context.state = this.state;
    }

    startGame() {
        this.app.stage.removeChildren();

        this.stage = Stage.Game;
        this.gameScreen = new Game(this.state);
        this.gameScreen.initialize();

        this.app.stage.addChild(this.gameScreen.sprite);
    }

    getWidth() { return this.app.stage.width; }
    getHeight() { return this.app.stage.height; }


    loop(delta: number) {
        //this.render();
    }
}

export default Application;