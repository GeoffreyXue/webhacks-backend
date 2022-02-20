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

  @type([TileState])
  tileStates: TileState[][];

  constructor() {
      super();
      this.playerStates = new ArraySchema();
      this.tileStates = new ArraySchema();
      for (let i = 0; i < 10; i++) {
        this.tileStates.push(new ArraySchema());
        let alternate = false;
        for (let j = 0; j < 10; j++) {
            this.tileStates[i].push(new TileState(alternate ? TeamColor.Blue : TeamColor.Red));
            alternate = !alternate;
        }
      }
  }

}