import { waitingRequest, executedRequest, port, debugSerial } from '../App'

export function createRequest(name: string, id: string): Promise<string> {
    return new Promise<string>((resolve) => {
        waitingRequest.set(id, name)
        debugSerial('send request %o, get %o', id, name)

        if (process.env.FAKE_ARDUINO == 'false') port.write(name + ':' + id)
        else executedRequest.set(id, name != 'all' ? Math.floor(Math.random() * 100) + '' : Math.floor(Math.random() * 100) + '@' + Math.floor(Math.random() * 100) + '@' + Math.floor(Math.random() * 100))

        let interval
        interval = setInterval(async () => {
            if (executedRequest.has(id)) {
                clearInterval(interval)
                debugSerial('finish request %o, value %o', id, executedRequest.get(id))
                resolve(executedRequest.get(id))
                executedRequest.set(id, null)
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
