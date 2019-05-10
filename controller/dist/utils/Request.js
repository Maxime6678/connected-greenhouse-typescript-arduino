"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const App_1 = require("../App");
var baseTemp = 20, baseHum = 60, baseLux = 200;
function createRequest(name, id) {
    return new Promise((resolve) => {
        App_1.waitingRequest.set(id, name);
        App_1.debugSerial('send request %o, get %o', id, name);
        App_1.port.write(name + ':' + id);
        App_1.debugSerial('send to arduino');
        /*if (process.env.FAKE_ARDUINO == 'false') {
            port.write(name + ':' + id)
            debugSerial('send to arduino')
        }
        else {
            executedRequest.set(id, name != 'all' ? Math.floor(Math.random() * 100) + '' : getFake(baseTemp) + '@' + getFake(baseHum) + '@' + getFake(baseLux))
            debugSerial('not send to arduino')
        }*/
        let interval;
        interval = setInterval(async () => {
            if (App_1.executedRequest.has(id)) {
                clearInterval(interval);
                App_1.debugSerial('finish request %o, value %o', id, App_1.executedRequest.get(id));
                resolve(App_1.executedRequest.get(id));
                App_1.executedRequest.set(id, String(null));
            }
        }, 10);
    });
}
exports.createRequest = createRequest;
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
function getFake(data) {
    if (getRandomInt(2))
        data += getRandomInt(2);
    else
        data -= getRandomInt(6);
    return data;
}
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
exports.getRandomInt = getRandomInt;
