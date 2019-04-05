import { RedisBuilder, RedisClientType, EventConstructor, SubscribeConstructor } from '../commons/Redis'
import { Redis } from 'ioredis'
import { debugRedis, redisClient } from '../App'
import { generateId, createRequest } from '../utils/Request'

export class RedisClient extends RedisBuilder {

    constructor(type: RedisClientType, host: string, password: string, port: number, database: number, name: string) {
        super(type, host, password, port, database, name)
    }

    onConnect(client: Redis) {
        debugRedis(this.name + ' connected')
    }

    onReady(client: Redis) {
        debugRedis(this.name + ' ready to work')
    }

    onError(client: Redis, err: string) {
        debugRedis(this.name + ' err: %O', err)
    }

}

export class EndEvent extends EventConstructor {

    execute(client: Redis) {
        return () => {
            debugRedis('losing connection, trying to reconnect')
        }
    }

}

export class RequestSubscribe extends SubscribeConstructor {

    execute(client: Redis, data: string) {
        let parse = JSON.parse(data)
        let possibilities = ['temp', 'hum', 'lux', 'all', 'lamp', 'water', 'open']
        if (parse.secret != process.env.REDIS_SECRET) return client.disconnect()
        debugRedis('request %o, get %o', parse.id, parse.need)

        if (possibilities.filter(x => x === parse.need).length != 0) {
            createRequest(parse.need, generateId()).then((data: string) => {
                debugRedis('callback %o, value %o', parse.id, data)
                redisClient.instance.publish('callback', JSON.stringify({
                    id: parse.id,
                    value: data
                }))
            })
        } else if (parse.need == 'status') {
            // todo
            debugRedis('callback %o, value %o', parse.id, 'status')
            redisClient.instance.publish('callback', JSON.stringify({
                id: parse.id,
                value: 'status'
            }))
        } else {
            debugRedis('callback %o, value %o', parse.id, null)
            redisClient.instance.publish('callback', JSON.stringify({
                id: parse.id,
                value: null
            }))
        }
    }

}