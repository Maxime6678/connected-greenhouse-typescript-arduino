import { RedisClient, EndEvent, RequestSubscribe } from './classes/ConnectorRedis'
import { RedisClientType } from './commons/Redis'

import SerialPort from 'serialport'
import Readline from '@serialport/parser-readline'
import debug from 'debug'
import { Control } from './utils/Control';

// Register variable
export var waitingRequest: Map<string, string> = new Map<string, string>()
export var executedRequest: Map<string, string> = new Map<string, string>()

// Register lib
export const debugSerial = debug('serial')
export const debugRedis = debug('redis')

// Register redis
export const redisClient = new RedisClient(RedisClientType.NORMAL, String(process.env.REDIS_HOST), String(process.env.REDIS_PASSWORD), Number(process.env.REDIS_PORT), 8, 'GH_Controller')
redisClient.registerEvent('end', new EndEvent())

export const redisSubscribe = new RedisClient(RedisClientType.SUBSCRIBER, String(process.env.REDIS_HOST), String(process.env.REDIS_PASSWORD), Number(process.env.REDIS_PORT), 8, 'GH_Controller_SUB')
redisSubscribe.registerSubscribe('request', new RequestSubscribe())
redisSubscribe.registerEvent('end', new EndEvent())

// Register control
export const control = new Control(redisClient, 30 * 1000)

// Register serial
let portName: any = null
export let port: SerialPort
let interval: NodeJS.Timeout
let parser

// Checking arduino connect
if (process.env.FAKE_ARDUINO == 'false') {
    SerialPort.list()
        .then((ports: any) => {
            let find = ports.find((port: { manufacturer: string; }) => /arduino/i.test(port.manufacturer))
            if (!find) {
                debugSerial('Arduino Not found Use fixed port')
                portName = "COM9"
            } else {
                portName = find.comName
                debugSerial('found arduino on %o', portName)
            }
        })

    interval = setInterval(() => {
        if (portName != null) {
            port = new SerialPort(portName, {
                baudRate: 9600
            })
            parser = port.pipe(new Readline({ delimiter: '\r\n' }))
            debugSerial('connected')
            redisClient.connect()
            redisSubscribe.connect()
            parser.on('data', (data: string) => {
                console.log('data receive: ', data)
                let dataParse = data.split(':')
                if (dataParse.length == 1) return
                executedRequest.set(dataParse[0], dataParse[1])
            })
            clearInterval(interval)
        }
    }, 1000)
} else {
    redisClient.connect()
    redisSubscribe.connect()
}
