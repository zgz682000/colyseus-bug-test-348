
import * as readline from "readline";
import * as Colyseus from "colyseus.js"

let rl = readline.createInterface(process.stdin, process.stdout);

async function questionAsync(query: string): Promise<string>{
    return new Promise((resolve, reject)=>{
        rl.question(query, async (answer: string)=>{
            resolve(answer)
        });
    });
}


let room: Colyseus.Room = null;
let client: Colyseus.Client = null;
let sessionId: string = null;
let roomId: string = null;

async function main(){
    client = new Colyseus.Client("ws://localhost:2567")
    room = await client.joinOrCreate("TestRoom")
    sessionId = room.sessionId;
    roomId = room.id;
    room.onError(clean);
    room.onLeave(onLeave);

    console.log("join room success");
    await questionAsync("now press any key to leave room");
    room.leave();
    console.log("leave room success");
    await questionAsync("now press any key to rejoin room");
    room = await client.reconnect(roomId, sessionId);
    room.onError(clean);
    room.onLeave(onLeave);
    console.log("rejoin room success");
}

async function onLeave(){
    console.log("why leave again?");
    clean();
}


main().then(()=>{})

function clean(){
    console.log("room clean");
    room?.leave();
    rl.close();
}

process.once("SIGTERM", ()=>{
    clean();
});

process.once("uncaughtException", (error: Error)=>{
    console.error(error);
    clean();
})

process.once("unhandledRejection", (reason)=>{
    console.error(reason);
    clean();
})