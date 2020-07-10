import { Graphics, Container, Sprite } from 'pixi.js';
import Context from '../context';
import PickResourceAction from '../actions/pickresource';

export interface ICellContent {
    toChar(): string
    render(): Container
}

export enum ResourceType { Wood, Wheat, Brick, Glass, Stone}

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

const resourceTypeToColor = (resource: ResourceType) : number => {
    switch(resource) {
        case ResourceType.Brick: return 0xFF4C1b;
        case ResourceType.Glass: return 0x2C95AB;
        case ResourceType.Stone: return 0xD8B790;
        case ResourceType.Wheat: return 0xFFBE00;
        case ResourceType.Wood: return  0xA24C2C;
        default: 0xFFFFFF;
    }
}

const CELL_HIGHLIGHT_BORDER_PADDING_PX = 4;
const CELL_HIGHLIGHT_BORDER_THICKNESS_PX = 4;
const CELL_SIZE_PX = 64;

export class Resource implements ICellContent {
    resource: ResourceType
    sprite: Graphics
    private init: boolean = false;

    constructor(resource: ResourceType) {
        this.resource = resource;
        this.sprite = new Graphics();
    }

    toChar(): string {
        return resourceTypeToString(this.resource)
    }

    render(): Container {
        if (!this.init) {
            fillResourceType(this.sprite, 0, 0, CELL_SIZE_PX/2, CELL_SIZE_PX/2, this.resource);
            
            this.init = true;
        }

        return this.sprite;
    }
}

function fillResourceType(sprite: Graphics, x:number, y: number, w: number, h: number, resource: ResourceType) {
    sprite.beginFill(resourceTypeToColor(resource), 1);
    sprite.drawRect(x, y, w, h);
    sprite.endFill();
}

export class Cell {
    x: number
    y: number
    sprite: Graphics

    private init: boolean = false;
    private content: ICellContent
    private newContent: boolean = false;
    private hovered: boolean = false;
    private highlightCellSprite: Graphics;
    private board: Board;

    constructor(board: Board, x: number, y: number) {
        this.x = x;
        this.y = y;

        this.board = board;

        this.sprite = new Graphics();

        this.sprite.interactive = true;
        this.sprite.on('pointerover', this.onPointerOver, this);
        this.sprite.on('pointerout', this.onPointerOut, this);
        this.sprite.on('click', this.onClick, this);
    }

    onPointerOver() {
        const {lastAction} = Context.state;
        if (!this.content && !this.hovered && lastAction instanceof PickResourceAction) {
            const {resource} = lastAction;
            const sprite = new Graphics();
            
            //TODO: replace with a 50% alpha of the content that would be added if clicked.
            sprite.beginFill(0xFFFFFF);
            sprite.drawRect(CELL_HIGHLIGHT_BORDER_PADDING_PX, CELL_HIGHLIGHT_BORDER_PADDING_PX, CELL_HIGHLIGHT_BORDER_THICKNESS_PX, CELL_SIZE_PX - CELL_HIGHLIGHT_BORDER_PADDING_PX * 2)
            sprite.drawRect(CELL_HIGHLIGHT_BORDER_PADDING_PX, CELL_HIGHLIGHT_BORDER_PADDING_PX, CELL_SIZE_PX - CELL_HIGHLIGHT_BORDER_PADDING_PX * 2, CELL_HIGHLIGHT_BORDER_THICKNESS_PX)
            sprite.drawRect(CELL_SIZE_PX - CELL_HIGHLIGHT_BORDER_THICKNESS_PX - CELL_HIGHLIGHT_BORDER_PADDING_PX, CELL_HIGHLIGHT_BORDER_PADDING_PX, CELL_HIGHLIGHT_BORDER_THICKNESS_PX, CELL_SIZE_PX - CELL_HIGHLIGHT_BORDER_PADDING_PX * 2)
            sprite.drawRect(CELL_HIGHLIGHT_BORDER_PADDING_PX, CELL_SIZE_PX - CELL_HIGHLIGHT_BORDER_THICKNESS_PX - CELL_HIGHLIGHT_BORDER_PADDING_PX, CELL_SIZE_PX - CELL_HIGHLIGHT_BORDER_PADDING_PX * 2, CELL_HIGHLIGHT_BORDER_THICKNESS_PX);
            sprite.endFill();

            //TODO: Right size here not 5.
            //fillResourceType(sprite, CELL_HIGHLIGHT_BORDER_PADDING_PX * 2, CELL_HIGHLIGHT_BORDER_PADDING_PX * 2, 5, 5, resource);

            this.sprite.addChild(sprite);

            this.highlightCellSprite = sprite;
            
            this.hovered = true;
        }

    }

    onPointerOut() {
        if (this.highlightCellSprite) {
            this.sprite.removeChild(this.highlightCellSprite);
        }

        this.hovered = false;
    }

    onClick() {
        if (this.highlightCellSprite) {
            const {lastAction} = Context.state;
            if (lastAction instanceof PickResourceAction && this.board.playResource(this.x, this.y, lastAction.resource)) {
                this.sprite.removeChild(this.highlightCellSprite);
                this.highlightCellSprite = null;
            }
        }
    }
    
    setContent(content: ICellContent) {
        this.content = content;
        this.newContent = true;
        this.render();
    }

    getContent(): ICellContent {
        return this.content;
    }

    render(): Container {
        if (!this.init || this.newContent) {
            this.sprite.clear();
            this.sprite.removeChildren();

            this.sprite.beginFill(0xABCDEF);
            this.sprite.drawRect(0, 0, CELL_SIZE_PX, CELL_SIZE_PX);
            this.sprite.endFill();

            this.sprite.beginFill(0xFFFFFF);
            this.sprite.drawRect(0,0,2,2);
            this.sprite.endFill();

            if (this.content) {
                const cellContainer = this.content.render();
                this.sprite.addChild(cellContainer);
                cellContainer.x = (this.sprite.width - cellContainer.width)/2;
                cellContainer.y = (this.sprite.height - cellContainer.height)/2;
            }
            
            this.init = true;
            this.newContent = false;
        }

        return this.sprite;
    }
}

const BOARD_BORDER_SIZE_PX = 10;

export class Board {
    cells: Array<Array<Cell>>
    sprite: Graphics
    private init: boolean = false;

    constructor(boardSize: number) {
        this.cells = new Array<Array<Cell>>(boardSize);
        this.sprite = new Graphics();

        for (let x: number = 0; x<boardSize; x++) {
            const row = new Array<Cell>(boardSize);
            this.cells[x] = row;

            for (let y: number = 0; y<boardSize; y++) {
                row[y] = new Cell(this, x, y);
            }
        }
    }

    playResource(x: number, y: number, resource: ResourceType): boolean {
        const cell = this.getCell(x, y);

        if (cell.getContent()) {
            throw new Error("Cell is already occupied by something");
        }

        cell.setContent(new Resource(resource));

        return true;
    }

    render() {
        const boardSize = this.cells.length;

        if (!this.init) {
            this.init = true;
            const size = this.cells.length * CELL_SIZE_PX + (BOARD_BORDER_SIZE_PX * 2);

            this.sprite.width = size;
            this.sprite.height = size;

            this.sprite.beginFill(0xFF0000);
            this.sprite.drawRect(0, 0, size, size);
            this.sprite.endFill();
            
            this.sprite.beginFill(0xAA0000);
            this.sprite.drawRect(0, 0, BOARD_BORDER_SIZE_PX, size);
            this.sprite.drawRect(0, 0, size, BOARD_BORDER_SIZE_PX);
            this.sprite.drawRect(size - BOARD_BORDER_SIZE_PX, 0, BOARD_BORDER_SIZE_PX, size);
            this.sprite.drawRect(0, size - BOARD_BORDER_SIZE_PX, size, BOARD_BORDER_SIZE_PX);
            this.sprite.endFill();

            for(let x = 0; x < boardSize; x++) {    
                for(let y = 0; y < boardSize; y++) {
                    const cellContainer = this.getCell(x, y).render();

                    this.sprite.addChild(cellContainer);

                    //TEMP
                    cellContainer.x = (x * CELL_SIZE_PX) + BOARD_BORDER_SIZE_PX;
                    cellContainer.y = (y * CELL_SIZE_PX) + BOARD_BORDER_SIZE_PX;
                }
            }

            return;
        }

        for(let x = 0; x < boardSize; x++) {    
            for(let y = 0; y < boardSize; y++) {
                this.getCell(x, y).render();
            }
        }
    }

    private getCell(x: number, y: number) {
        return this.cells[x][y];
    }
}
