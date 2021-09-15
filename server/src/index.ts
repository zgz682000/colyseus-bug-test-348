
import { Server } from "colyseus";
import cors from "cors";
import express from "express";
import { TestRoom } from "./test.room";
import http from "http";
import { WebSocketTransport } from "@colyseus/ws-transport";

async function main(){
    
    const port = Number(process.env.PORT || 2567);
    const app = express()
    const server = http.createServer(app);


    const transport = new WebSocketTransport({
        server,
    });

    app.use(cors());
    app.use(express.json())

    const gameServer = new Server({
        transport,
        gracefullyShutdown: true
    });

    gameServer.define("TestRoom", TestRoom);

    gameServer.listen(port);
    console.log(`Listening on ws://localhost:${port}`)
}


main().then(()=>{
}).catch(e=>{
    throw e;
})
