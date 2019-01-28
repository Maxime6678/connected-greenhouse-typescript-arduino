import { ExpressBuilder } from '../../builders/Express'
import { debugExpress } from './../../App'
import { indexRouter } from './../../routers/Index'

export class ManagerSite extends ExpressBuilder {

    constructor(port: number, listen: boolean) {
        super(port, listen)
    }

    public onListen() {
        debugExpress('Server listen on %o', this.port)
    }

    public registerLib() { }

    public registerRouter() {
        this.app.use(indexRouter.url, indexRouter.router)
    }

}