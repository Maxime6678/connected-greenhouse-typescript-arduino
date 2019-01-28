import { ManagerSite } from './utils/express/ManagerSite'
import * as debug from 'debug'

// Register libs
export const debugExpress = debug('express')

// Register site
export const managerSite = new ManagerSite(3000, true)