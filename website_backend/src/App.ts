import { ManagerSite } from './classes/ManagerSite'
import { RedisClient, EndEvent, CallbackSubscribe } from './classes/ConnectorRedis'
import { RedisClientType } from './commons/Redis'

import * as debug from 'debug'

// Register variable
export var haveError: boolean = false
export var Errors: Map<string, any> = new Map<string, any>()
export var waitingRequest: Map<string, string> = new Map<string, string>()
export var executedRequest: Map<string, string> = new Map<string, string>()

// Register libs
export const Passport = require('./utils/Passport')
export const debugExpress = debug('express')
export const debugRedis = debug('redis')

// Register site
export const managerSite = new ManagerSite(3000, true)

// Register redis
export const redisClient = new RedisClient(RedisClientType.NORMAL, process.env.REDIS_HOST, process.env.REDIS_PASSWORD, Number(process.env.REDIS_PORT), 8, 'GH_Website')
redisClient.registerEvent('end', new EndEvent())
redisClient.connect()

export const redisSubscribe = new RedisClient(RedisClientType.SUBSCRIBER, process.env.REDIS_HOST, process.env.REDIS_PASSWORD, Number(process.env.REDIS_PORT), 8, 'GH_Website_SUB')
redisSubscribe.registerSubscribe('callback', new CallbackSubscribe())
redisSubscribe.registerEvent('end', new EndEvent())
redisSubscribe.connect()