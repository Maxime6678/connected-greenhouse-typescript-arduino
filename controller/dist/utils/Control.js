"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Request_1 = require("./Request");
const dateformat_1 = __importDefault(require("dateformat"));
const App_1 = require("../App");
class Control {
    constructor(instance, refresh) {
        this.instance = instance;
        this.refresh = refresh;
        let isPast = true;
        setInterval(() => {
            let minute = parseInt(dateformat_1.default(new Date(), 'MM').split('')[dateformat_1.default(new Date(), 'MM').split('').length - 1]);
            if (minute % 5 == 0) {
                let p = minute == 0 ? true : false;
                if (p != isPast) {
                    isPast = !isPast;
                    this.check();
                }
            }
        }, this.refresh);
    }
    check() {
        Request_1.createRequest('all', Request_1.generateId()).then((data) => {
            let parse = data.split('@'); // 0 = temp, 1 = hum, 2 = lux
            this.saveData(data);
            if (parse[0] > '20') {
                App_1.debugRedis('TEMP ALERT');
            }
        });
    }
    saveData(data) {
        this.haveDate((err, res) => {
            if (!res)
                this.createDate();
            this.getDate((err, res) => {
                let parse = JSON.parse(res);
                let newData = {
                    date: dateformat_1.default(new Date(), 'UTC:yyyy-mm-dd"T"HH:MM:ss"Z"'),
                    data: data
                };
                parse.push(newData);
                this.instance.set('schedule:' + dateformat_1.default(new Date(), 'ddmmyy'), JSON.stringify(parse), () => null);
            });
        });
    }
    haveDate(callback) {
        this.instance.get('schedule:' + dateformat_1.default(new Date(), 'ddmmyy'), (err, res) => {
            callback(err, res ? true : false);
        });
    }
    createDate() {
        this.instance.set('schedule:' + dateformat_1.default(new Date(), 'ddmmyy'), '[]', () => null);
    }
    getDate(callback) {
        this.instance.get('schedule:' + dateformat_1.default(new Date(), 'ddmmyy'), (err, res) => {
            callback(err, String(res));
        });
    }
}
exports.Control = Control;
