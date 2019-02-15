import { SocketBuilder, EventBuilder } from '../commons/Socket'
import { debugSocket, executedRequest } from '../App'
import { Server, Socket } from 'socket.io'
import { createRequest, generateId } from '../utils/Request';

export var stateToUser: Map<string, Socket> = new Map<string, Socket>()
export var userToState: Map<Socket, string> = new Map<Socket, string>()

export class ConnectorSocket extends SocketBuilder {

    constructor(port: number) {
        super(port)
    }

    public onReady() {
        debugSocket('Server listen on ' + this.port)
    }

}

export class InitEvent extends EventBuilder {

    public execute(io: Server, client: Socket) {
        return (state, secret) => {
            if (secret != process.env.SOCKET_SECRET) return client.disconnect()
            let states = ['_website']

            if (states.filter(x => x === state)) {
                if (!userToState.has(client)) {
                    stateToUser.set(userToState.get(client), null)
                    userToState.set(client, null)
                }

                debugSocket('client init %o %o', state, client.id)
                stateToUser.set(state, client)
                userToState.set(client, state)
            } else {
                debugSocket('close 1')
                return client.disconnect()
            }
        }
    }

}

export class InfoEvent extends EventBuilder {

    public execute(io: Server, client: Socket) {
        return async (id: string, data: string) => {
            if (!userToState.has(client)) {
                debugSocket('close 2')
                return client.disconnect()
            }

            switch (data[0]) {
                case 'temp': {
                    let idReq = generateId()
                    createRequest('temp', idReq).then((data: string) => {
                        client.emit('callback', id, data)
                    })
                    break
                }

                case 'hum': {
                    let idReq = generateId()
                    createRequest('hum', idReq).then((data: string) => {
                        client.emit('callback', id, data)
                    })
                    break
                }

                case 'all': {
                    let idReq = generateId()
                    createRequest('all', idReq).then((data: string) => {
                        client.emit('callback', id, data)
                    })
                    break
                }

                case 'lux': {
                    let idReq = generateId()
                    createRequest('lux', idReq).then((data: string) => {
                        client.emit('callback', id, data)
                    })
                    break
                }

                case 'default': {
                    debugSocket('close 3')
                    client.disconnect()
                    break
                }
            }
        }
    }

}

export class StatusEvent extends EventBuilder {

    public execute(io: Server, client: Socket) {
        return () => {
            let result: string
            let ns = io.of('/')
            debugSocket('status from %o', userToState.get(client))

            for (let id in ns.connected) {
                if (userToState.has(ns.clients[id])) {
                    result += userToState.get(ns.clients[id]) + ':'
                }
                ns.clients[id].disconnect()
            }
            result.substring(0, result.length - 1)

            stateToUser.get('_website').emit('statusWebsite', result)
        }
    }

}