"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Redis_1 = require("../commons/Redis");
const App_1 = require("../App");
class RedisClient extends Redis_1.RedisBuilder {
    constructor(type, host, password, port, database, name) {
        super(type, host, password, port, database, name);
    }
    onConnect(client) {
        App_1.debugRedis(this.name + ' connected');
    }
    onReady(client) {
        App_1.debugRedis(this.name + ' ready to work');
    }
    onError(client, err) {
        App_1.debugRedis(this.name + ' err: %O', err);
    }
}
exports.RedisClient = RedisClient;
class EndEvent extends Redis_1.EventConstructor {
    execute(client) {
        return () => {
            App_1.debugRedis('losing connection, trying to reconnect');
        };
    }
}
exports.EndEvent = EndEvent;
class CallbackSubscribe extends Redis_1.SubscribeConstructor {
    execute(client, data) {
        let parse = JSON.parse(data);
        if (App_1.waitingRequest.has(parse.id)) {
            App_1.waitingRequest.set(parse.id, String(null));
            App_1.executedRequest.set(parse.id, parse.value);
        }
    }
}
exports.CallbackSubscribe = CallbackSubscribe;
