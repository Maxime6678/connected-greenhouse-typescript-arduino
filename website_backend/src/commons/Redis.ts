import * as Redis from 'ioredis'

/*
 * This project is under MIT License
 * View LICENSE for more details
 *
 * Copyright (c) 2019 Maxime6678
 */

/**
 * Installation:
 *      npm install ioredis @types/ioredis
 * 
 * Exemple:
 * 
 *      class Normal extends RedisBuilder {
 *      
 *          constructor(type: RedisClientType, host: string, password: string, port: number, database: number, name: string) {
 *              super(type, host, password, port, database, name)
 *          }
 *      
 *          onConnect(client: Redis.Redis) {
 *              console.log(`normal connected!`)
 *          }
 *      
 *          onReady(client: Redis.Redis) {
 *              console.log(`normal ready!`)
 *          }
 *      
 *          onError(client: Redis.Redis, err: string) {
 *              console.log(`normal error: ${err}`)
 *          }
 *      
 *      }
 *      
 *      class Subscriber extends RedisBuilder {
 *      
 *          constructor(type: RedisClientType, host: string, password: string, port: number, database: number, name: string) {
 *              super(type, host, password, port, database, name)
 *          }
 *      
 *          onConnect(client: Redis.Redis) {
 *              console.log(`subcriber connected!`)
 *          }
 *      
 *          onReady(client: Redis.Redis) {
 *              console.log(`subcriber ready!`)
 *          }
 *      
 *          onError(client: Redis.Redis, err: string) {
 *              console.log(`subcriber error: ${err}`)
 *          }
 *      
 *      }
 *      
 *      class EndEvent extends EventConstructor {
 *      
 *          execute(client: Redis.Redis) {
 *              return () => {
 *                  console.log(`${client.config.name} end connection`)
 *              }
 *          }
 *      
 *      }
 *      
 *      class ChannelSubscribe extends SubscribeConstructor {
 *      
 *          execute(client: Redis.Redis, data: string) {
 *              console.log(`${client.config.name} receive ${data} on 'channel'`)
 *          }
 *      
 *      }
 *      
 *      const normal = new Normal(RedisClientType.NORMAL, process.env.REDIS_HOST, process.env.REDIS_PASSWORD, Number(process.env.REDIS_PORT), 0, 'Normal')
 *      normal.registerEvent('end', new EndEvent())
 *      normal.connect()
 *      
 *      const subscribe = new Subscriber(RedisClientType.SUBSCRIBER, process.env.REDIS_HOST, process.env.REDIS_PASSWORD, Number(process.env.REDIS_PORT), 0, 'Subscribe')
 *      subscribe.registerSubscribe('channel', new ChannelSubscribe())
 *      subscribe.registerEvent('end', new EndEvent())
 *      subscribe.connect()
 * 
 */

type Key = string | Buffer

/**
 * NORMAL: Use this for an account for get/set/setex.
 * SUBSCRIBER: Use this for an account for pub/sub.
 *
 * @export
 * @enum {string}
 */
export enum RedisClientType {
    NORMAL, SUBSCRIBER
}

/**
 * Use this as extends for create a Redis instance more easiest.
 *
 * @export
 * @abstract
 * @class RedisBuilder
 */
export abstract class RedisBuilder {

    private type: RedisClientType
    private host: string
    private password: string
    private port: number
    private database: number
    public readonly name: string
    public readonly instance: Redis.Redis
    private subscribe: Map<string, SubscribeConstructor>

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
    constructor(type: RedisClientType, host: string, password: string, port: number, database: number, name: string) {
        this.type = type
        this.host = host
        this.password = password
        this.port = port
        this.database = database
        this.name = name
        if (type == RedisClientType.SUBSCRIBER) this.subscribe = new Map<string, SubscribeConstructor>()
        this.instance = new Redis(this.getRedisParam())
        this.instance.on('connect', () => this.onConnect(this.instance))
        this.instance.on('ready', () => this.onReady(this.instance))
        this.instance.on('error', (err: string) => this.onError(this.instance, err))
        if (this.type == RedisClientType.SUBSCRIBER) {
            this.instance.on('message', (channel: string, data: string) => {
                if (this.subscribe.has(channel)) this.subscribe.get(channel).execute(this.instance, data)
            })
        }
    }

    /**
     * Return parameters for create redis instance.
     *
     * @private
     * @returns {Redis.RedisOptions}
     * @memberof RedisBuilder
     */
    private getRedisParam(): Redis.RedisOptions {
        return {
            host: this.host,
            password: this.password,
            port: this.port,
            db: this.database,
            connectionName: this.name,
            lazyConnect: true
        }
    }

    /**
     * Login the instance to the Redis server.
     *
     * @memberof RedisBuilder
     */
    public connect(): void {
        if (this.type == RedisClientType.NORMAL) this.instance.connect()
    }

    /**
     * Return the data for a key
     *
     * @param {Key} key Provide the key of data
     * @param {((err: Error, res: string | null) => void)} callback Return err if have err or data
     * @memberof RedisBuilder
     */
    public get(key: Key, callback: (err: Error, res: string | null) => void): void {
        if (this.type == RedisClientType.NORMAL) this.instance.get(key, callback)
        else callback(new Error('Subcriber instance cannot execute get command !'), null)
    }

    /**
     * Create a new row with key and data
     *
     * @param {Key} key Provide the key of the new row
     * @param {*} value Provide the data of the new row
     * @param {((err: Error, res: string | null) => void)} [callback] Return err if have err or new data
     * @memberof RedisBuilder
     */
    public set(key: Key, value: any, callback?: (err: Error, res: string | null) => void): void {
        if (this.type == RedisClientType.NORMAL) callback ? this.instance.set(key, value, callback) : this.instance.set(key, value)
        else callback(new Error('Subcriber instance cannot execute set command !'), null)
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
    public setex(key: Key, seconds: number, value: any, callback?: (err: Error, res: string | null) => void): void {
        if (this.type == RedisClientType.NORMAL) callback ? this.instance.setex(key, seconds, value, callback) : this.instance.setex(key, seconds, value)
        else callback(new Error('Subcriber instance cannot execute setex command !'), null)
    }

    /**
     * Register a event for your instance
     *
     * @param {string} name The name of your event
     * @param {EventConstructor} event Instance of EventConstructor class
     * @memberof RedisBuilder
     */
    public registerEvent(name: string, event: EventConstructor): void {
        this.instance.on(name, event.execute(this.instance))
    }

    /**
     * Register a event for your instance
     *
     * @param {string} name The name of your subscribe channel
     * @param {SubscribeConstructor} subcribe Instance of SubscribeConstructor class
     * @memberof RedisBuilder
     */
    public registerSubscribe(name: string, subcribe: SubscribeConstructor): void {
        if (this.type == RedisClientType.SUBSCRIBER) {
            this.subscribe.set(name, subcribe)
            this.instance.subscribe(name)
        }
    }

    /**
     * Execute when the instance is connected.
     *
     * @abstract
     * @param {Redis.Redis} instance Provide the instance of connection
     * @memberof RedisBuilder
     */
    public abstract onConnect(instance: Redis.Redis)

    /**
     * Execute when the instance is ready.
     *
     * @abstract
     * @param {Redis.Redis} instance Provide the instance of connection
     * @memberof RedisBuilder
     */
    public abstract onReady(instance: Redis.Redis)

    /**
     * Execute when the instance trigger an error
     *
     * @abstract
     * @param {Redis.Redis} instance Provide the instance of connection
     * @param {string} err Provide the error from the instance
     * @memberof RedisBuilder
     */
    public abstract onError(instance: Redis.Redis, err: string)

}

/**
 * Use this as extends for create a event more easiest.
 *
 * @export
 * @abstract
 * @class EventConstructor
 */
export abstract class EventConstructor {

    /**
     * Execute when the event is trigged.
     *
     * @abstract
     * @param {Redis.Redis} client Provide the instance of connection
     * @returns {(...args: string[]) => void} Return the function that the event must execute
     * @memberof EventConstructor
     */
    public abstract execute(client: Redis.Redis): (...args: string[]) => void

}

/**
 * Use this as extends for create a subcribe more easiest.
 *
 * @export
 * @abstract
 * @class SubscribeConstructor
 */
export abstract class SubscribeConstructor {

    /**
     * Execute when the channel is trigged.
     *
     * @abstract
     * @param {Redis.Redis} client Provide the instance of connection
     * @param {string} data Provide the data of the trigger
     * @memberof SubscribeConstructor
     */
    public abstract execute(client: Redis.Redis, data: string): void

}