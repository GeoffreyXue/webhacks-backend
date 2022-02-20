import { Schema, ArraySchema, Context, type } from "@colyseus/schema";

export enum TeamColor {
    Red,
    Blue,
}

export class PlayerState extends Schema {
    @type('string')
    id: string;

    @type('string')
    name: string;

    @type('number')
    team: TeamColor;

    constructor(id: string, name: string, team: TeamColor) {
        super();

        this.id = id;
        this.name = name;
        this.team = team;
    }
}

export class TileState extends Schema {
    @type('number')
    color: TeamColor;

    constructor(color: TeamColor) {
        super();

        this.color = color;
    }
}

export class TileArray extends Schema {
    @type([TileState])
    tiles: TileState[];

    constructor() {
        super();

        this.tiles = [];
    }
}

export enum GameState {
    Waiting,
    Playing,
    Ended
}

export class RoomState extends Schema {
    @type([PlayerState]) 
    playerStates: PlayerState[];

    @type('number')
    gameState: GameState;

    @type([TileArray])
    tileStates: TileArray[];

    constructor() {
        super();
        this.playerStates = new ArraySchema();
        this.gameState = GameState.Waiting;
        this.tileStates = new ArraySchema();
        for (let i = 0; i < 10; i++) {
            this.tileStates.push(new TileArray());
            let alternate = false;
            for (let j = 0; j < 10; j++) {
                this.tileStates[i].tiles.push(new TileState(alternate ? TeamColor.Blue : TeamColor.Red));
                alternate = !alternate;
            }
        }
    }

    public resetGame() {
        this.gameState = GameState.Waiting;
        this.tileStates = new ArraySchema();
        for (let i = 0; i < 10; i++) {
            this.tileStates.push(new TileArray());
            let alternate = false;
            for (let j = 0; j < 10; j++) {
                this.tileStates[i].tiles.push(new TileState(alternate ? TeamColor.Blue : TeamColor.Red));
                alternate = !alternate;
            }
        }
    }
}