import { waitingRequest, executedRequest, port, debugSocket, debugSerial } from '../App'

export function createRequest(name: string, id: string): Promise<string> {
    waitingRequest.set(id, name)
    debugSerial('send: %o', name + ':' + id)
    port.write(name + ':' + id)
    return new Promise<string>(async (resolve) => {
        while (true) {
            if (executedRequest.has(id)) {
                debugSerial('found request: %o with %o', id, executedRequest.get(id))
                resolve(executedRequest.get(id))
                break
            }
            await delay(20)
        }
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

async function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}