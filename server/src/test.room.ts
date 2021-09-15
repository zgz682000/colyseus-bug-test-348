import { Room, Client, ErrorCode, Deferred } from "colyseus";
import { Schema, type } from "@colyseus/schema"

export interface GameRoomUserInfo {
  client: Client;
  chair: number;
  userId: string;
  reconnection?: Deferred
}


class TestRoomState extends Schema {
  @type("boolean") dummy: boolean = false;
}


export class TestRoom extends Room <TestRoomState> {


  async onCreate(options: any) {
    this.setState(new TestRoomState());
    this.autoDispose = true;
    this.maxClients = 1;
    this.setPatchRate(0);
  }

  async onJoin(client: Client, options: any) {

  }

  async onLeave(client: Client, consented: boolean) {
    console.log("client leave, waiting for reconnection");
    await this.allowReconnection(client);
    console.log("client reconnected");
  }

  async onDispose() {
    
  }

}
