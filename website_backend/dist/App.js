"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ManagerSite_1 = require("./classes/ManagerSite");
const ConnectorRedis_1 = require("./classes/ConnectorRedis");
const Redis_1 = require("./commons/Redis");
const debug_1 = __importDefault(require("debug"));
// Register variable
exports.haveError = false;
exports.Errors = new Map();
exports.waitingRequest = new Map();
exports.executedRequest = new Map();
// Register libs
exports.Passport = require('./utils/Passport');
exports.debugExpress = debug_1.default('express');
exports.debugRedis = debug_1.default('redis');
exports.debugPrinc = debug_1.default('debug');
// Register site
exports.managerSite = new ManagerSite_1.ManagerSite(3000, true);
// Register redis
exports.redisClient = new ConnectorRedis_1.RedisClient(Redis_1.RedisClientType.NORMAL, String(process.env.REDIS_HOST), String(process.env.REDIS_PASSWORD), Number(process.env.REDIS_PORT), 8, 'GH_Website');
exports.redisClient.registerEvent('end', new ConnectorRedis_1.EndEvent());
exports.redisClient.connect();
exports.redisSubscribe = new ConnectorRedis_1.RedisClient(Redis_1.RedisClientType.SUBSCRIBER, String(process.env.REDIS_HOST), String(process.env.REDIS_PASSWORD), Number(process.env.REDIS_PORT), 8, 'GH_Website_SUB');
exports.redisSubscribe.registerSubscribe('callback', new ConnectorRedis_1.CallbackSubscribe());
exports.redisSubscribe.registerEvent('end', new ConnectorRedis_1.EndEvent());
exports.redisSubscribe.connect();
