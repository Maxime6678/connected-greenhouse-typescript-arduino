"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
/**
 * NORMAL: Use this for an account for get/set/setex.
 * SUBSCRIBER: Use this for an account for pub/sub.
 *
 * @export
 * @enum {string}
 */
var RedisClientType;
(function (RedisClientType) {
    RedisClientType[RedisClientType["NORMAL"] = 0] = "NORMAL";
    RedisClientType[RedisClientType["SUBSCRIBER"] = 1] = "SUBSCRIBER";
})(RedisClientType = exports.RedisClientType || (exports.RedisClientType = {}));
/**
 * Use this as extends for create a Redis instance more easiest.
 *
 * @export
 * @abstract
 * @class RedisBuilder
 */
class RedisBuilder {
    /**
     * Creates an instance of RedisBuilder.
     * @param {RedisClientType} type Provide the type of Client
     * @param {string} host Provide the host of the server
     * @param {string} password Provide the password of the server
     * @param {number} port Provide the port of the server
     * @param {number} database Provide the database you want to use
     * @param {string} name Provide the name of the connection
     * @memberof RedisBuilder
     */
    constructor(type, host, password, port, database, name) {
        this.type = type;
        this.host = host;
        this.password = password;
        this.port = port;
        this.database = database;
        this.name = name;
        this.subscribe = new Map();
        if (type == RedisClientType.SUBSCRIBER)
            this.subscribe = new Map();
        this.instance = new ioredis_1.default(this.getRedisParam());
        this.instance.on('connect', () => this.onConnect(this.instance));
        this.instance.on('ready', () => this.onReady(this.instance));
        this.instance.on('error', (err) => this.onError(this.instance, err));
        if (this.type == RedisClientType.SUBSCRIBER) {
            this.instance.on('message', (channel, data) => {
                if (this.subscribe.has(channel))
                    this.subscribe.get(channel).execute(this.instance, data);
            });
        }
    }
    /**
     * Return parameters for create redis instance.
     *
     * @private
     * @returns {Redis.RedisOptions}
     * @memberof RedisBuilder
     */
    getRedisParam() {
        return {
            host: this.host,
            password: this.password,
            port: this.port,
            db: this.database,
            connectionName: this.name,
            lazyConnect: true
        };
    }
    /**
     * Login the instance to the Redis server.
     *
     * @memberof RedisBuilder
     */
    connect() {
        if (this.type == RedisClientType.NORMAL)
            this.instance.connect();
    }
    /**
     * Return the data for a key
     *
     * @param {Key} key Provide the key of data
     * @param {((err: Error, res: string | null) => void)} callback Return err if have err or data
     * @memberof RedisBuilder
     */
    get(key, callback) {
        if (this.type == RedisClientType.NORMAL)
            this.instance.get(key, callback);
        else
            callback(new Error('Subcriber instance cannot execute get command !'), null);
    }
    /**
     * Create a new row with key and data
     *
     * @param {Key} key Provide the key of the new row
     * @param {*} value Provide the data of the new row
     * @param {((err: Error, res: string | null) => void)} [callback] Return err if have err or new data
     * @memberof RedisBuilder
     */
    set(key, value, callback) {
        if (this.type == RedisClientType.NORMAL)
            callback ? this.instance.set(key, value, callback) : this.instance.set(key, value);
        else
            callback(new Error('Subcriber instance cannot execute set command !'), null);
    }
    /**
     * Create a new row with key and data for x seconds
     *
     * @param {Key} key Provide the key of the new row
     * @param {number} seconds Provide the seconds of data stay
     * @param {*} value Provide the data of the new row
     * @param {((err: Error, res: string | null) => void)} [callback] Return err if have err or new data
     * @memberof RedisBuilder
     */
    setex(key, seconds, value, callback) {
        if (this.type == RedisClientType.NORMAL)
            callback ? this.instance.setex(key, seconds, value, callback) : this.instance.setex(key, seconds, value);
        else
            callback(new Error('Subcriber instance cannot execute setex command !'), null);
    }
    /**
     * Register a event for your instance
     *
     * @param {string} name The name of your event
     * @param {EventConstructor} event Instance of EventConstructor class
     * @memberof RedisBuilder
     */
    registerEvent(name, event) {
        this.instance.on(name, event.execute(this.instance));
    }
    /**
     * Register a event for your instance
     *
     * @param {string} name The name of your subscribe channel
     * @param {SubscribeConstructor} subcribe Instance of SubscribeConstructor class
     * @memberof RedisBuilder
     */
    registerSubscribe(name, subcribe) {
        if (this.type == RedisClientType.SUBSCRIBER) {
            this.subscribe.set(name, subcribe);
            this.instance.subscribe(name);
        }
    }
}
exports.RedisBuilder = RedisBuilder;
/**
 * Use this as extends for create a event more easiest.
 *
 * @export
 * @abstract
 * @class EventConstructor
 */
class EventConstructor {
}
exports.EventConstructor = EventConstructor;
/**
 * Use this as extends for create a subcribe more easiest.
 *
 * @export
 * @abstract
 * @class SubscribeConstructor
 */
class SubscribeConstructor {
}
exports.SubscribeConstructor = SubscribeConstructor;
