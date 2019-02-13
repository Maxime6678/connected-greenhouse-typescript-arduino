import * as socket from 'socket.io-client'

export abstract class SocketClientConstructor {

    public readonly socket: SocketIOClient.Socket

    constructor(url: string) {
        this.socket = socket(url)
        this.socket.on('connect', this.onConnect(this.socket))
        this.socket.on('disconnect', this.onDisconnect(this.socket))
    }

    public registerEvent(name: string, event: EventBuilder) {
        this.socket.on(name, event.execute(this.socket))
    }

    public abstract onConnect(socket: SocketIOClient.Socket): (...args: any[]) => void

    public abstract onDisconnect(socket: SocketIOClient.Socket): (...args: any[]) => void

}

export abstract class EventBuilder {

    public abstract execute(socket: SocketIOClient.Socket): (...args: any[]) => void

}