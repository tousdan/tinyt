import Application from './app';
import * as _ from 'lodash';
import { Player } from './player';
import { Board, ResourceType } from './game/board';
import Game from './game/game';
import Action from './actions/Action';
import GameStartAction from './actions/gamestart';
import AddResourceAction from './actions/addresource';
import PickResourceAction from './actions/pickresource';

const BOARD_SIZE = 4;
class GameState {
    app: Application
    players: Array<Player>
    private actions: Array<Action>
    lastAction: Action

    constructor(app: Application) {
        this.app = app;
        this.actions = [];
    }

    setPlayerCount(count: number) {
        this.players = [];

        for (let playerNumber = 0; playerNumber < count; playerNumber++) {
            const result = new Player("Player #" + (playerNumber + 1), new Board(BOARD_SIZE));

            this.players.push(result);
        };

        this.pushAction(new GameStartAction(count));
        this.app.startGame();


        if (this.players.length > 1) {
            const result = this.players[0];

            this.playResourceForPlayer(result, 0, 0, ResourceType.Wheat);
            this.playResourceForPlayer(result, 0, 1, ResourceType.Glass);
            this.playResourceForPlayer(result, 0, 2, ResourceType.Brick);

            this.playResourceForPlayer(result, 1, 0, ResourceType.Stone);
            this.playResourceForPlayer(result, 1, 1, ResourceType.Stone);
            this.playResourceForPlayer(result, 1, 2, ResourceType.Glass);

            this.playResourceForPlayer(result, 2, 0, ResourceType.Brick);
            this.playResourceForPlayer(result, 2, 2, ResourceType.Glass);

            this.playResourceForPlayer(result, 3, 0, ResourceType.Brick);
            this.playResourceForPlayer(result, 3, 1, ResourceType.Stone);
            this.playResourceForPlayer(result, 3, 2, ResourceType.Glass);
            this.playResourceForPlayer(result, 3, 3, ResourceType.Wood);
        }

        this.pickNextResourceToPlay(this.players[0], ResourceType.Brick);
    }

    playResourceForPlayer(player: Player, x: number, y: number, resource: ResourceType) {
        this.pushAction(new AddResourceAction(player, x, y, resource));

        player.board.playResource(x, y, resource);
        player.render();
    }

    pickNextResourceToPlay(player: Player, resource: ResourceType) {
        this.pushAction(new PickResourceAction(player, resource));
    }

    private pushAction(action: Action) {
        this.actions.push(action);
        this.lastAction = action;
    }
}

export default GameState;