import { ExpressBuilder } from './../commons/Express'
import { debugExpress } from '../App'
import { indexRouter } from '../routers/Index'

import * as express from 'express'
import * as path from 'path'

export class ManagerSite extends ExpressBuilder {

    constructor(port: number, listen: boolean) {
        super(port, listen)
    }

    public onListen() {
        debugExpress('Server listen on %o', this.port)
    }

    public registerLib() {
        this.app.set('views', path.join(__dirname, './views'))

        this.app.use(express.static(path.join(__dirname, './static'), { maxAge: '7d' }))
    }

    public registerRouter() {
        this.app.use(indexRouter.url, indexRouter.router)
    }

}