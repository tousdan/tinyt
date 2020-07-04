import * as PIXI from 'pixi.js'
import * as _ from 'lodash';
import GameState from '../gamestate';

const MAX_PLAYER_COUNT = 4;

class Intro {
    private gameState: GameState;
    sprite : PIXI.Graphics;

    constructor(gameState: GameState) {
        this.gameState = gameState;
        this.sprite = new PIXI.Graphics();
        this.sprite.width = gameState.app.getWidth();
        this.sprite.height = gameState.app.getHeight();

        const welcome = new PIXI.Text("Welcome to tinyt");
        const playerPrompt = new PIXI.Text("How many players?");

        const onPlayerCountSelect = (n: number) => () => {
            this.onPlayerCountSelected(n);
        }


        const buildButton = (num: number) => {
            const text = new PIXI.Text(num + "");
            const button = new PIXI.Graphics();
        
            button.addChild(text);

            button.beginFill(0x000000);
            button
                .drawRect(0, 0, button.width, 2)
                .drawRect(0, button.height - 2, button.width, 2)
                .drawRect(0, 0, 2, button.height)
                .drawRect(button.width - 2, 0, 2, button.height);

            button.interactive = true;
            button.on('click', onPlayerCountSelect(num), this);


            return button;
        };

        const playerSelectionGroup = new PIXI.Graphics();
        playerSelectionGroup.width = 300;

        for (let i = 0; i < MAX_PLAYER_COUNT; i++) {
            const playerButton = buildButton(i+1);

            playerSelectionGroup.addChild(playerButton);

            playerButton.y = 100;
            playerButton.x = 50 * (i+1)
        }
        
        this.sprite.addChild(welcome);
        this.sprite.addChild(playerPrompt);
        this.sprite.addChild(playerSelectionGroup);

        playerPrompt.y = welcome.y + welcome.height;
    }

    onPlayerCountSelected = (playerCount: number) => {
        this.gameState.setPlayerCount(playerCount);
    }




}

export default Intro;