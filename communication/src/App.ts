import * as Socket from 'socket.io'

export abstract class SocketBuilder {

    public readonly io: Socket.Server
    public readonly port: number
    public readonly socket: Socket.Socket

    constructor(port: number, listen: boolean) {
        this.port = port
        this.io = Socket()
        let socketProvide
        this.io.on('connection', (socket: Socket.Socket) => {
            socket.on('init', (data: string) => {
                console.log(data)
            })
        })
        this.socket = socketProvide
        if (listen) this.io.listen(this.port) && this.onReady()
    }

    public listen(): void {
        this.io.listen(this.port)
        this.onReady()
    }

    public registerEvent(name: string, event: EventBuilder): void {
        this.socket.on(name, event.execute(this.io))
    }

    public abstract onReady(): void

}

export abstract class EventBuilder {

    public abstract execute(io: Socket.Server): (...args: any[]) => void
}

export class SocketServer extends SocketBuilder {

    constructor(port: number, listen: boolean) {
        super(port, listen)
    }

    public onReady() {
        console.log('server ready!')
    }

}

export class InitEvent extends EventBuilder {

    public execute(io: Socket.Server) {
        return (data: string) => {
            console.log(data)
        }
    }

}

const socketServer = new SocketServer(5000, true)
//socketServer.registerEvent('init', new InitEvent())
//socketServer.listen()

import * as SocketClient from 'socket.io-client'

const client = SocketClient('http://127.0.0.1:5000')
client.on('connect', () => client.emit('init', 'hello'))