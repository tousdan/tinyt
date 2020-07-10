import Action from "./Action";
import { Player } from "../player";
import { ResourceType } from "../game/board";

export default class AddResourceAction implements Action {
    player: Player;
    x: number;
    y: number;
    resource: ResourceType;

    constructor(player: Player, x: number, y: number, resource: ResourceType) {
        this.player = player;
        this.x = x;
        this.y = y;
        this.resource = resource;
    }
}