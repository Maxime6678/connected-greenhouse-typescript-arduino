import { waitingRequest, executedRequest, debugRedis, redisClient } from '../App'

export function createRequest(name: string, id: string): Promise<string> {
    return new Promise<string>((resolve) => {
        waitingRequest.set(id, name)
        debugRedis('send request %o, get %o', id, name)

        redisClient.instance.publish('request', JSON.stringify({
            secret: process.env.REDIS_SECRET,
            id: id,
            need: name
        }))

        let interval: NodeJS.Timeout
        interval = setInterval(async () => {
            if (executedRequest.has(id)) {
                clearInterval(interval)
                debugRedis('finish request %o, value %o', id, executedRequest.get(id))
                await delay(1000)
                resolve(executedRequest.get(id))
                executedRequest.set(id, String(null))
            }
        }, 10)
    })
}

export function createRequestDo(action: string, option: string, id: string) {
    waitingRequest.set(id, action)
    debugRedis('send request %o, get %o', id, action)

    redisClient.instance.publish('request', JSON.stringify({
        secret: process.env.REDIS_SECRET,
        id: id,
        need: action,
        option: option
    }))
}

export function generateId(): string {
    let result = ''
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    do {
        for (var i = 0; i < 10; i++)
            result += possible.charAt(Math.floor(Math.random() * possible.length))
    } while (waitingRequest.has(result) || executedRequest.has(result))

    return result
}

async function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}