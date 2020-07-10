import Action from "./Action";

export default class GameStartAction implements Action {
    playerCount: number;

    constructor(playerCount: number) {
        this.playerCount = playerCount;
    }
}