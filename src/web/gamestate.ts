import Application from './app';
import * as _ from 'lodash';
import { Player } from './player';
import { Board, ResourceType } from './game/board';

const BOARD_SIZE = 4;
class GameState {
    app : Application
    players : Array<Player>
    

    constructor(app: Application) {
        this.app = app;
        
    }

    setPlayerCount(count: number) {
        this.players = [];

        for (let playerNumber = 0; playerNumber < count; playerNumber++) {
            const result = new Player("Player #" + (playerNumber + 1), new Board(BOARD_SIZE));

            if (playerNumber == 0) {
                result.board.playResource(0, 0, ResourceType.Wheat);
                result.board.playResource(0, 1, ResourceType.Glass);
                result.board.playResource(0, 2, ResourceType.Brick);

                result.board.playResource(1, 0, ResourceType.Stone);
                result.board.playResource(1, 1, ResourceType.Stone);
                result.board.playResource(1, 2, ResourceType.Glass);

                result.board.playResource(2, 0, ResourceType.Brick);
                result.board.playResource(2, 2, ResourceType.Glass);

                result.board.playResource(3, 0, ResourceType.Brick);
                result.board.playResource(3, 1, ResourceType.Stone);
                result.board.playResource(3, 2, ResourceType.Glass);
                result.board.playResource(3, 3, ResourceType.Wood);
            }

            this.players.push(result);
        };

        this.app.startGame();
    }
}

export default GameState;