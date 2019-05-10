"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const App_1 = require("../App");
function createRequest(name, id) {
    return new Promise((resolve) => {
        App_1.waitingRequest.set(id, name);
        App_1.debugRedis('send request %o, get %o', id, name);
        App_1.redisClient.instance.publish('request', JSON.stringify({
            secret: process.env.REDIS_SECRET,
            id: id,
            need: name
        }));
        let interval;
        interval = setInterval(async () => {
            if (App_1.executedRequest.has(id)) {
                clearInterval(interval);
                App_1.debugRedis('finish request %o, value %o', id, App_1.executedRequest.get(id));
                resolve(App_1.executedRequest.get(id));
                App_1.executedRequest.set(id, String(null));
            }
        }, 10);
    });
}
exports.createRequest = createRequest;
function createRequestDo(action, option, id) {
    App_1.waitingRequest.set(id, action);
    App_1.debugRedis('send request %o, get %o', id, action);
    App_1.redisClient.instance.publish('request', JSON.stringify({
        secret: process.env.REDIS_SECRET,
        id: id,
        need: action,
        option: option
    }));
}
exports.createRequestDo = createRequestDo;
function generateId() {
    let result = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    do {
        for (var i = 0; i < 10; i++)
            result += possible.charAt(Math.floor(Math.random() * possible.length));
    } while (App_1.waitingRequest.has(result) || App_1.executedRequest.has(result));
    return result;
}
exports.generateId = generateId;
async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
