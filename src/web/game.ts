import * as PIXI from 'pixi.js'
import * as _ from 'lodash';
import { Player } from './player';

const WIDTH = 1024;
const HEIGHT = 1024;

const BOARD_POSITIONS = [
    [10, 10],
    [310, 10],
    [610, 10],
    []
]
class Game {
    app: PIXI.Application
    players: Array<Player>

    constructor(document: Document, players: Array<Player>) {
        this.app = new PIXI.Application({ 
            width: WIDTH, 
            height: HEIGHT,
            resolution: 1 
        });

        this.app.ticker.add((delta) => this.loop(delta))

        this.players = players;

        document.body.appendChild(this.app.view);

        this.initialize();
    }

    initialize() {
        for (let i = 0; i < this.players.length; i++) {
            const player = this.players[i];
            
            player.render();

            const playerContainer = player.getContainer();

            const [x, y] = BOARD_POSITIONS[i];
            playerContainer.x = x;
            playerContainer.y = y;

            this.app.stage.addChild(playerContainer);
        }
        _.each(this.players, player => {
            
        });
    }

    render() {
        _.each(this.players, player => {
            player.render();
        })
    }

    loop(delta: number) {
        //this.render();
    }
}

export default Game;