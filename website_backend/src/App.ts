import { ManagerSite } from './classes/ManagerSite'
import * as debug from 'debug'
import { ClientSocket, CallbackEvent } from './classes/Connector'

// Register variable
export var haveError: boolean = false
export var Errors: Map<string, any> = new Map<string, any>()
export var waitingRequest: Map<string, string> = new Map<string, string>()
export var executedRequest: Map<string, string> = new Map<string, string>()

// Register libs
export const Passport = require('./utils/Passport')
export const debugExpress = debug('express')
export const debugSocket = debug('socket')

// Register site
export const managerSite = new ManagerSite(3000, true)

// Register socket client
export const clientSocket = new ClientSocket('http://127.0.0.1:5000')

// Register event
clientSocket.registerEvent('callback', new CallbackEvent())