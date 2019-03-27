"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = __importDefault(require("socket.io"));
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
class SocketBuilder {
    /**
     * Creates an instance of SocketBuilder.
     * @param {number} port Provide the port for the server
     * @memberof SocketBuilder
     */
    constructor(port) {
        this.port = port;
        this.io = socket_io_1.default();
        this.events = new Map();
    }
    /**
     * Listen your Socket.io server to the world.
     *
     * @memberof SocketBuilder
     */
    listen() {
        this.io.on('connection', (socket) => {
            this.events.forEach((event, key) => {
                socket.on(key, event.execute(this.io, socket));
            });
        });
        this.io.listen(this.port);
        this.onReady();
    }
    /**
     * Register a event for Socket.io server
     *
     * @param {string} name The name of your event
     * @param {EventBuilder} event Instance of EventBuilder class
     * @memberof SocketBuilder
     */
    registerEvent(name, event) {
        this.events.set(name, event);
    }
}
exports.SocketBuilder = SocketBuilder;
/**
 * Use this as extends for create a Socket.io event more easiest.
 *
 * @export
 * @abstract
 * @class EventBuilder
 */
class EventBuilder {
}
exports.EventBuilder = EventBuilder;
