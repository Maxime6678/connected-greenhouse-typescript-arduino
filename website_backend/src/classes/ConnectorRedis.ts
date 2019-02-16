import { RedisBuilder, RedisClientType, EventConstructor, SubscribeConstructor } from '../commons/Redis'
import { Redis } from 'ioredis'
import { debugRedis, waitingRequest, executedRequest } from '../App'

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

export class CallbackSubscribe extends SubscribeConstructor {

    execute(client: Redis, data: string) {
        let parse = JSON.parse(data)

        if (waitingRequest.has(parse.id)) {
            waitingRequest.set(parse.id, null)
            executedRequest.set(parse.id, parse.value)
        }
    }

}