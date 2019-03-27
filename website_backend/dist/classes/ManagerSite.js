"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Express_1 = require("./../commons/Express");
const App_1 = require("../App");
const Index_1 = require("../routers/Index");
const Api_1 = require("../routers/Api");
const express = __importStar(require("express"));
const passport_1 = __importDefault(require("passport"));
const path = __importStar(require("path"));
class ManagerSite extends Express_1.ExpressBuilder {
    constructor(port, listen) {
        super(port, listen);
    }
    onListen() {
        App_1.debugExpress('Server listen on %o', this.port);
    }
    registerLib() {
        this.app.set('views', path.join(__dirname, './../../src/views'));
        this.app.set('view engine', 'pug');
        this.app.use(express.static(path.join(__dirname, './../../src/static'), { maxAge: '7d' }));
        this.app.use(require('cookie-parser')());
        this.app.use(require('body-parser').urlencoded({
            extended: true
        }));
        this.app.use(require('express-session')({
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false
        }));
        this.app.use(require('connect-flash')());
        this.app.use(require('cors')());
        this.app.use(passport_1.default.initialize());
        this.app.use(passport_1.default.session());
    }
    registerRouter() {
        this.app.use(Index_1.indexRouter.url, Index_1.indexRouter.router);
        this.app.use(Api_1.apiRouter.url, Api_1.apiRouter.router);
    }
}
exports.ManagerSite = ManagerSite;
