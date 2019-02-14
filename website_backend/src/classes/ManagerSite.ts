import { ExpressBuilder } from './../commons/Express'
import { debugExpress } from '../App'
import { indexRouter } from '../routers/Index'
import { apiRouter } from '../routers/Api'

import * as express from 'express'
import * as passport from 'passport'
import * as path from 'path'
import { } from 'connect-flash'

export class ManagerSite extends ExpressBuilder {

    constructor(port: number, listen: boolean) {
        super(port, listen)
    }

    public onListen() {
        debugExpress('Server listen on %o', this.port)
    }

    public registerLib() {
        this.app.set('views', path.join(__dirname, './../views'))
        this.app.set('view engine', 'pug')

        this.app.use(express.static(path.join(__dirname, './../static'), { maxAge: '7d' }))

        this.app.use(require('cookie-parser')())
        this.app.use(require('body-parser').urlencoded({
            extended: true
        }));
        this.app.use(require('express-session')({
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false
        }));
        this.app.use(require('connect-flash')())
        this.app.use(require('cors')())

        this.app.use(passport.initialize())
        this.app.use(passport.session())
    }

    public registerRouter() {
        this.app.use(indexRouter.url, indexRouter.router)
        this.app.use(apiRouter.url, apiRouter.router)
    }

}