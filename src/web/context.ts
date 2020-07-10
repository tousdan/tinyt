import Game from './game/game';
import GameState from './gamestate';

class Context {
    state: GameState;
}

let instance: Context;

if (instance == null) {
    instance = new Context();
}

export default instance;