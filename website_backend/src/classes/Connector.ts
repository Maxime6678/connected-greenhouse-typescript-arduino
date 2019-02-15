import { SocketClientConstructor, EventBuilder } from '../commons/SocketClient'
import { debugSocket, waitingRequest, executedRequest } from '../App'

export class ClientSocket extends SocketClientConstructor {

    constructor(url: string) {
        super(url)
    }

    public onConnect(socket: SocketIOClient.Socket) {
        return () => {
            debugSocket('connected to master')
            socket.emit('init', '_website', process.env.SOCKET_SECRET)
        }
    }

    public onDisconnect(socket: SocketIOClient.Socket) {
        return () => {
            debugSocket('disconnect from master')
        }
    }

}

export class CallbackEvent extends EventBuilder {

    public execute(socket: SocketIOClient.Socket) {
        return (id: string, data: string) => {
            if (waitingRequest.has(id)) {
                waitingRequest.set(id, null)
                executedRequest.set(id, data)
            }
        }
    }

}