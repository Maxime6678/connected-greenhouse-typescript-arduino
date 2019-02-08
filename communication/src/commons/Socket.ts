import * as Socket from 'socket.io'

/*
 * This project is under MIT License
 * View LICENSE for more details
 *
 * Copyright (c) 2019 Maxime6678
 */

/**
 * Installation:
 *      npm install socket.io @types/socket.io
 * 
 * Exemple:
 * 
 *      export class SocketServer extends SocketBuilder {
 *      
 *          constructor(port: number) {
 *              super(port)
 *          }
 *      
 *          public onReady() {
 *              console.log('server ready!')
 *          }
 *      
 *      }
 *      
 *      export class InitEvent extends EventBuilder {
 *      
 *          public execute(io: Socket.Server) {
 *              return (data: string) => {
 *                  console.log(data)
 *              }
 *          }
 *      
 *      }
 *      
 *      const socketServer = new SocketServer(5000)
 *      socketServer.registerEvent('init', new InitEvent())
 *      socketServer.listen()
 * 
 */

/**
 * Use this as extends for create a Socket.io server more easiest.
 *
 * @export
 * @abstract
 * @class SocketBuilder
 */
export abstract class SocketBuilder {

    public readonly io: Socket.Server
    public readonly port: number
    public readonly socket: Socket.Socket
    private events: Map<string, EventBuilder>

    /**
     * Creates an instance of SocketBuilder.
     * @param {number} port Provide the port for the server
     * @memberof SocketBuilder
     */
    constructor(port: number) {
        this.port = port
        this.io = Socket()
        this.events = new Map<string, EventBuilder>()
    }

    /**
     * Listen your Socket.io server to the world.
     *
     * @memberof SocketBuilder
     */
    public listen(): void {
        this.io.on('connection', (socket: Socket.Socket) => {
            this.events.forEach((event: EventBuilder, key: string) => {
                socket.on(key, event.execute(this.io))
            })
        })
        this.io.listen(this.port)
        this.onReady()
    }

    /**
     * Register a event for Socket.io server
     *
     * @param {string} name The name of your event
     * @param {EventBuilder} event Instance of EventBuilder class
     * @memberof SocketBuilder
     */
    public registerEvent(name: string, event: EventBuilder): void {
        this.events.set(name, event)
    }

    /**
     * Execute when the Socket.io server is ready.
     *
     * @abstract
     * @memberof SocketBuilder
     */
    public abstract onReady(): void

}

/**
 * Use this as extends for create a Socket.io event more easiest.
 *
 * @export
 * @abstract
 * @class EventBuilder
 */
export abstract class EventBuilder {

    /**
     * Execute when the event is trigged.
     *
     * @abstract
     * @param {Socket.Server} io Provide the io for broadcast ...
     * @returns {(...args: any[]) => void} Return the function that the event must execute
     * @memberof EventBuilder
     */
    public abstract execute(io: Socket.Server): (...args: any[]) => void

}