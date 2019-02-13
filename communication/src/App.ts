import * as SerialPort from 'SerialPort'
import * as Readline from '@serialport/parser-readline'
import { ConnectorSocket, InitEvent } from './classes/Connector'

import * as debug from 'debug'

// Register lib
export var executedRequest: Array<string> = new Array<string>()
export const debugSocket = debug('socket')

// Register socket
export const connectorSocket = new ConnectorSocket(5000)
connectorSocket.registerEvent('init', new InitEvent())

// Listen socket
connectorSocket.listen()

/* let portName: string = null
let port: SerialPort
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
        console.log('find: ' + portName)
    })

interval = setInterval(() => {
    if (portName != null) {
        port = new SerialPort(portName, {
            baudRate: 9600
        })
        parser = port.pipe(new Readline({ delimiter: '\r\n' }))
        console.log('connected')
        parser.on('data', console.log)
        clearInterval(interval)
    }
}, 1000) */