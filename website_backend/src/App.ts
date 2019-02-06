import { ManagerSite } from './classes/ManagerSite'
import * as debug from 'debug'

// Register variable
export var haveError: boolean = false
export var Errors: Map<string, any> = new Map<string, any>()

// Register libs
export const Passport = require('./utils/Passport')
export const debugExpress = debug('express')

// Register site
export const managerSite = new ManagerSite(3000, true)