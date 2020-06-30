import * as PIXI from 'pixi.js'
import * as _ from 'lodash';
import { Player } from './player';

const WIDTH = 1024;
const HEIGHT = 1024;

class Game {
    app: PIXI.Application
    players: Array<Player>

    constructor(document: Document, players: Array<Player>) {
        this.app = new PIXI.Application({ 
            width: WIDTH, 
            height: HEIGHT,
            resolution: 1 
        });

        this.players = players;

        document.body.appendChild(this.app.view);

        this.initialize();
    }

    initialize() {
        _.each(this.players, player => {
            player.board.render();

            this.app.stage.addChild(player.board.sprite);
        });
    }

    render() {
        _.each(this.players, player => {
            player.board.render();
        })
    }
}

export default Game;