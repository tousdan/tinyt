import Action from "./Action";
import { Player } from "../player";
import { ResourceType } from "../game/board";

export default class PickResourceAction implements Action {
    player: Player;
    resource: ResourceType;

    constructor(player: Player, resource: ResourceType) {
        this.player = player;
        this.resource = resource;
    }
}