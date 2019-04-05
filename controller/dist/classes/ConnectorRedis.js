"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Redis_1 = require("../commons/Redis");
const App_1 = require("../App");
const Request_1 = require("../utils/Request");
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
class RequestSubscribe extends Redis_1.SubscribeConstructor {
    execute(client, data) {
        let parse = JSON.parse(data);
        let possibilities = ['temp', 'hum', 'lux', 'all', 'lamp', 'water', 'open'];
        if (parse.secret != process.env.REDIS_SECRET)
            return client.disconnect();
        App_1.debugRedis('request %o, get %o', parse.id, parse.need);
        if (possibilities.filter(x => x === parse.need).length != 0) {
            Request_1.createRequest(parse.need, Request_1.generateId()).then((data) => {
                App_1.debugRedis('callback %o, value %o', parse.id, data);
                App_1.redisClient.instance.publish('callback', JSON.stringify({
                    id: parse.id,
                    value: data
                }));
            });
        }
        else if (parse.need == 'status') {
            // todo
            App_1.debugRedis('callback %o, value %o', parse.id, 'status');
            App_1.redisClient.instance.publish('callback', JSON.stringify({
                id: parse.id,
                value: 'status'
            }));
        }
        else {
            App_1.debugRedis('callback %o, value %o', parse.id, null);
            App_1.redisClient.instance.publish('callback', JSON.stringify({
                id: parse.id,
                value: null
            }));
        }
    }
}
exports.RequestSubscribe = RequestSubscribe;
