import { Room, Client } from "colyseus";
import { RoomState, PlayerState, TeamColor } from "./schema/RoomState";

export class GameRoom extends Room<RoomState> {

  onCreate (options: any) {
    this.setState(new RoomState());

    this.onMessage("type", (client, message) => {
      //
      // handle "type" message
      //
    });

  }

  onJoin (client: Client, options: any) {
    console.log(options.name, "joined!");
    let state = this.state;
    let player = new PlayerState(
        client.sessionId, 
        options.name, 
        Math.floor(Math.random() * 2) ? TeamColor.Red : TeamColor.Blue
    );
    state.playerStates.push(player);
    // this.setState(state);
  }

  onLeave (client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
