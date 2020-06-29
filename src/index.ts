import * as _ from 'lodash';
import Application from './app';

interface ICellContent {
    toChar(): string
}

enum ResourceType { Wood, Wheat, Brick, Glass, Stone}

const resourceTypeToString = (resource: ResourceType) : string => {
    switch(resource) {
        case ResourceType.Brick: return 'b';
        case ResourceType.Glass: return 'g';
        case ResourceType.Stone: return 's';
        case ResourceType.Wheat: return 'w';
        case ResourceType.Wood: return 'W';
        default: return '?';
    }
}

class Resource implements ICellContent {
    resource: ResourceType

    constructor(resource: ResourceType) {
        this.resource = resource;
    }

    toChar(): string {
        return resourceTypeToString(this.resource)
    }
}

class Cell {
    x: number
    y: number
    content: ICellContent
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

class Board {
    cells: Array<Array<Cell>>

    constructor(boardSize: number) {
        this.cells = new Array<Array<Cell>>(boardSize);

        for (let x: number = 0; x<boardSize; x++) {
            const row = new Array<Cell>(boardSize);
            this.cells[x] = row;

            for (let y: number = 0; y<boardSize; y++) {
                row[y] = new Cell(x, y);
            }
        }
    }

    playResource(x: number, y: number, resource: ResourceType) {
        const cell = this.getCell(x, y);

        if (cell.content) {
            throw new Error("Cell is already occupied by something");
        }

        cell.content = new Resource(resource);
    }

    private getCell(x: number, y: number) {
        return this.cells[x][y];
    }
}

class ConsoleRenderer {
    renderBoard(board: Board) {
        _.each(board.cells, (row) => {
            const rowCellsStr = _.map(row, (cell) => {
                return cell.content ? cell.content.toChar() : '.';
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

class Player {
    name: string
    board: Board
    canBuildMonument: boolean = true;

    constructor(name: string, board: Board) {
        this.name = name;
        this.board = board;
    }
}

const p1 = new Player("Player #1", new Board(5));
const p2 = new Player("Player #2", new Board(5));


p1.board.playResource(0, 0, ResourceType.Wood);
p1.board.playResource(1, 1, ResourceType.Stone);

p2.board.playResource(4, 4, ResourceType.Wood);
p2.board.playResource(3, 3, ResourceType.Stone);


new ConsoleRenderer().renderPlayer(p1);
new ConsoleRenderer().renderPlayer(p2);

new Application(window.document);