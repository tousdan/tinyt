import * as PIXI from 'pixi.js'
import * as _ from 'lodash';
import GameState from '../gamestate';

class Game {
    gameState: GameState
    sprite: PIXI.Container

    constructor(gameState: GameState) {
        this.gameState = gameState;
        this.sprite = new PIXI.Container();
        
        this.initialize();
    }

    initialize() {
        const { players } = this.gameState;

        for (let i = 0; i < players.length; i++) {
            const player = players[i];
            
            player.render();

            const playerContainer = player.getContainer();

            playerContainer.x = 10 + 300 * i;
            playerContainer.y = 10;

            this.sprite.addChild(playerContainer);
        }
    }

    render() {
        _.each(this.gameState.players, player => {
            player.render();
        })
    }

}

export default Game;