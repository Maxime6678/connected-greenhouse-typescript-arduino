import { waitingRequest, executedRequest, port, debugSerial } from '../App'

var baseTemp = 20, baseHum = 60, baseLux = 200

export function createRequest(name: string, id: string): Promise<string> {
    return new Promise<string>((resolve) => {
        waitingRequest.set(id, name)
        debugSerial('send request %o, get %o', id, name)

        if (process.env.FAKE_ARDUINO == 'false') {
            port.write(name + ':' + id + '\n')
            debugSerial('send to arduino')
        }
        else {
            executedRequest.set(id, name != 'all' ? Math.floor(Math.random() * 100) + '' : getFake(baseTemp) + '@' + getFake(baseHum) + '@' + getFake(baseLux))
            debugSerial('not send to arduino')
        }

        let interval: NodeJS.Timeout
        interval = setInterval(async () => {
            if (executedRequest.has(id)) {
                clearInterval(interval)
                debugSerial('finish request %o, value %o', id, executedRequest.get(id))
                resolve(executedRequest.get(id))
                executedRequest.set(id, String(null))
            }
        }, 10)
    })
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

function getFake(data: number) {
    if (getRandomInt(2)) data += getRandomInt(2)
    else data -= getRandomInt(6)
    return data
}

export function getRandomInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max));
}
