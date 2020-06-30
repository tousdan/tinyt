import * as _ from 'lodash';
import Application from './game';
import { ResourceType, Board } from './board';
import { Player } from './player';



class ConsoleRenderer {
    renderBoard(board: Board) {
        _.each(board.cells, (row) => {
            const rowCellsStr = _.map(row, (cell) => {
                return cell.getContent() ? cell.getContent().toChar() : '.';
            })

            console.log(rowCellsStr.join(''));
        })
    }

    renderPlayer(player: Player) {
        console.log(player.name);
        console.log('-----');
        this.renderBoard(player.board);
    }
}

const p1 = new Player("Player #1", new Board(5));
const p2 = new Player("Player #2", new Board(5));


p1.board.playResource(0, 0, ResourceType.Wood);
p1.board.playResource(0, 1, ResourceType.Stone);
p1.board.playResource(0, 2, ResourceType.Brick);
p1.board.playResource(0, 3, ResourceType.Glass);
p1.board.playResource(1, 0, ResourceType.Stone);
p1.board.playResource(1, 1, ResourceType.Wood);
p1.board.playResource(1, 2, ResourceType.Wood);
p1.board.playResource(1, 3, ResourceType.Wood);
p1.board.playResource(3, 0, ResourceType.Wood);
p1.board.playResource(3, 1, ResourceType.Wood);
p1.board.playResource(3, 2, ResourceType.Wood);
p1.board.playResource(3, 3, ResourceType.Wood);


p2.board.playResource(4, 4, ResourceType.Wood);
p2.board.playResource(3, 3, ResourceType.Stone);


new ConsoleRenderer().renderPlayer(p1);
new ConsoleRenderer().renderPlayer(p2);

const app = new Application(window.document, [ p1 ]);

app.render();