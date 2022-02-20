import { Room, Client, Delayed } from "colyseus";
import { RoomState, PlayerState, GameState, TeamColor } from "./schema/RoomState";

export class GameRoom extends Room<RoomState> {
    public delayedInterval!: Delayed;

    onCreate (options: any) {
        this.setState(new RoomState());
        console.log('ON CREATE', this.state.gameState);

        this.onMessage("game-start", (client, message) => {
            this.state.gameState = GameState.Playing;
            this.broadcast("tile-update", this.state.tileStates);
            this.broadcast("game-start", this.state.gameState);

            this.clock.start();

            const startingTime = this.clock.currentTime;

            // Set an interval and store a reference to it
            // so that we may clear it later
            this.delayedInterval = this.clock.setInterval(() => {
                // console.log("Time now " + this.clock.currentTime);
                const time = Math.ceil((60_000 + startingTime - this.clock.currentTime) / 1000);
                this.broadcast("game-time", time)
            }, 1000);
    
            // After 60 seconds clear the timeout;
            // this will *stop and destroy* the timeout completely
            this.clock.setTimeout(() => {
                this.delayedInterval.clear();
                this.state.gameState = GameState.Ended;
                this.broadcast("game-end", this.state.gameState);
                this.state.gameState = GameState.Waiting;
            }, 60_000);
        })

        this.onMessage("flip", (client, {x, y, team}) => {
            this.state.tileStates.at(x).tiles.at(y).color = team;
            this.broadcast("tile-update", this.state.tileStates);
        });
    }

    onJoin (client: Client, options: any) {
        console.log('ON JOIN');
        let moreBlue = this.state.playerStates.filter(p => p.team == TeamColor.Blue).length > 
            this.state.playerStates.filter(p => p.team == TeamColor.Red).length;
        let player = new PlayerState(
            client.sessionId, 
            options.name, 
            moreBlue ? TeamColor.Red : TeamColor.Blue
        );
        this.state.playerStates.push(player);
        this.broadcast("player-join", this.state.playerStates);
        this.broadcast("game-start", this.state.gameState);
        this.broadcast("tile-update", this.state.tileStates);
    }

    onLeave (client: Client, consented: boolean) {
        console.log(client.sessionId, "left!");
        this.state.playerStates.splice(this.state.playerStates.findIndex(p => p.id == client.sessionId), 1);
        this.broadcast("player-leave", this.state.playerStates);
    }

    onDispose() {
        console.log("room", this.roomId, "disposing...");
    }

}
