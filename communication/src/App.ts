import * as SerialPort from 'SerialPort'
import * as Readline from '@serialport/parser-readline'
import { ConnectorSocket, InitEvent, InfoEvent } from './classes/Connector'

import * as debug from 'debug'

// Register variable
export var waitingRequest: Map<string, string> = new Map<string, string>()
export var executedRequest: Map<string, string> = new Map<string, string>()

// Register lib
export const debugSocket = debug('socket')
export const debugSerial = debug('serial')

// Register socket
export const connectorSocket = new ConnectorSocket(5000)
connectorSocket.registerEvent('init', new InitEvent())
connectorSocket.registerEvent('info', new InfoEvent())

let portName: string = null
export let port: SerialPort
let interval
let parser

SerialPort.list()
    .then(ports => {
        let find = ports.find(port => /arduino/i.test(port.manufacturer))
        if (!find) {
            console.error('Arduino Not found')
            process.exit(1)
        }
        portName = find.comName
        debugSerial('found arduino on %o', portName)
    })

interval = setInterval(() => {
    if (portName != null) {
        port = new SerialPort(portName, {
            baudRate: 9600
        })
        parser = port.pipe(new Readline({ delimiter: '\r\n' }))
        debugSerial('connected')
        connectorSocket.listen()
        parser.on('data', (data: string) => {
            let dataParse = data.split(':')
            if (dataParse.length == 1) return
            executedRequest.set(dataParse[0], dataParse[1])
        })
        clearInterval(interval)
    }
}, 1000)