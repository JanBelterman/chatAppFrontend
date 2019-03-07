import { Injectable } from "@angular/core"
import { Subject, Observable } from "rxjs"
import { environment } from "src/environments/environment"
import * as io from 'socket.io-client'
import { ThreadsService } from "./threads.service";
import { Message } from "../models/message";

@Injectable({
    providedIn: 'root'
})
export class WebsocketService {

    constructor() {
        this.newMessageFromSocket = new Subject()
    }

    // Event
    newMessageFromSocket: Subject<{ threadId: String, message: Message }>

    connected: boolean = false
    private socket: any

    /*  Connects to socket server */
    connect() {
        this.connected = true
        this.socket = io(environment.ws_url, { transports: ['websocket'] })
        this.socket.on('message', (data: any) => {
            this.newMessageFromSocket.next(data)
        })
    }

    // Disconnects from socket server
    disconnect() {
        this.connected = false
        this.socket.disconnect()
    }

}