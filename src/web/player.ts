import { Board } from './board';
import { Container, Graphics, Text, TextStyle } from 'pixi.js';

export class Player {
    name: string
    board: Board
    canBuildMonument: boolean = true;
    private sprite: Graphics;
    private init = false;

    constructor(name: string, board: Board) {
        this.name = name;
        this.board = board;
        this.sprite = new Graphics();
    }

    getContainer() : Container {
        return this.sprite;
    }

    render() {
        if (!this.init) {
            this.init = true;
            this.board.render();

            const boardSprite = this.board.sprite;
            this.sprite.addChild(boardSprite);
            boardSprite.x = 0;
            boardSprite.y = 0;

            const name = new Text(this.name, new TextStyle({
                fill: 'white'
            }));

            this.sprite.addChild(name);
            name.x = 0;
            name.y = boardSprite.height;


            return;
        }

        this.board.render();
    }
}