import { Board } from './board';

export class Player {
    name: string
    board: Board
    canBuildMonument: boolean = true;

    constructor(name: string, board: Board) {
        this.name = name;
        this.board = board;
    }
}