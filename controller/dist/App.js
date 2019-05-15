"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ConnectorRedis_1 = require("./classes/ConnectorRedis");
const Redis_1 = require("./commons/Redis");
const serialport_1 = __importDefault(require("serialport"));
const parser_readline_1 = __importDefault(require("@serialport/parser-readline"));
const debug_1 = __importDefault(require("debug"));
const Control_1 = require("./utils/Control");
// Register variable
exports.waitingRequest = new Map();
exports.executedRequest = new Map();
// Register lib
exports.debugSerial = debug_1.default('serial');
exports.debugRedis = debug_1.default('redis');
// Register redis
exports.redisClient = new ConnectorRedis_1.RedisClient(Redis_1.RedisClientType.NORMAL, String(process.env.REDIS_HOST), String(process.env.REDIS_PASSWORD), Number(process.env.REDIS_PORT), 8, 'GH_Controller');
exports.redisClient.registerEvent('end', new ConnectorRedis_1.EndEvent());
exports.redisSubscribe = new ConnectorRedis_1.RedisClient(Redis_1.RedisClientType.SUBSCRIBER, String(process.env.REDIS_HOST), String(process.env.REDIS_PASSWORD), Number(process.env.REDIS_PORT), 8, 'GH_Controller_SUB');
exports.redisSubscribe.registerSubscribe('request', new ConnectorRedis_1.RequestSubscribe());
exports.redisSubscribe.registerEvent('end', new ConnectorRedis_1.EndEvent());
// Register control
exports.control = new Control_1.Control(exports.redisClient, 30 * 1000);
// Register serial
let portName = null;
let interval;
let parser;
// Checking arduino connect
if (process.env.FAKE_ARDUINO == 'false') {
    serialport_1.default.list()
        .then((ports) => {
        let find = ports.find((port) => /arduino/i.test(port.manufacturer));
        if (!find) {
            exports.debugSerial('Arduino Not found Use fixed port');
            portName = "COM9";
        }
        else {
            portName = find.comName;
            exports.debugSerial('found arduino on %o', portName);
        }
    });
    interval = setInterval(() => {
        if (portName != null) {
            exports.port = new serialport_1.default(portName, {
                baudRate: 115200
            });
            parser = exports.port.pipe(new parser_readline_1.default({ delimiter: '\r\n' }));
            exports.debugSerial('connected');
            exports.redisClient.connect();
            exports.redisSubscribe.connect();
            parser.on('data', (data) => {
                console.log('data receive: ', data);
                let dataParse = data.split(':');
                if (dataParse.length == 1)
                    return;
                exports.executedRequest.set(dataParse[0], dataParse[1]);
            });
            clearInterval(interval);
        }
    }, 1000);
}
else {
    exports.redisClient.connect();
    exports.redisSubscribe.connect();
}
