import { SocketClientConstructor } from '../commons/SocketClient'
import { debugSocket } from '../App';

export class ClientSocket extends SocketClientConstructor {

    constructor(url: string) {
        super(url)
    }

    public onConnect(socket: SocketIOClient.Socket) {
        return () => {
            debugSocket('connected to master')
            socket.emit('init', '_website', process.env.SOCKET_PASSWORD)
        }
    }

    public onDisconnect(socket: SocketIOClient.Socket) {
        return () => {
            debugSocket('disconnect from master')
        }
    }

}