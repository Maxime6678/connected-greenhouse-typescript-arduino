import { ManagerSite } from './classes/ManagerSite'
import * as debug from 'debug'
import { ClientSocket } from './classes/Connector';

// Register variable
export var haveError: boolean = false
export var Errors: Map<string, any> = new Map<string, any>()

// Register libs
export const Passport = require('./utils/Passport')
export const debugExpress = debug('express')
export const debugSocket = debug('socket')

// Register site
export const managerSite = new ManagerSite(3000, true)

// Register socket client
export const clientSocket = new ClientSocket('http://127.0.0.1:5000')