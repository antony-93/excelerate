import { Server } from "http";
import WebSocket from "ws";

export default async function (server: Server) {
    return new WebSocket.Server({ server })
}