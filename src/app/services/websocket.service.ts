import { Injectable } from "@angular/core"
import { Subject, Observable } from "rxjs"
import { environment } from "src/environments/environment"
import * as io from 'socket.io-client'

@Injectable({
    providedIn: 'root'
})
export class WebsocketService {

    /*  Connects to socket server & returns subject for message event */
    connect(): Subject<MessageEvent> {
        const socket = io(environment.ws_url, { transports: ['websocket'] })
        let observable = new Observable(observer => {
            socket.on('message', (data: any) => {
                observer.next(data)
            })
            return () => {
                socket.disconnect()
            }
        })
        return Subject.create(null, observable)
    }

}