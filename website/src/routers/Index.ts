import { RouterBuilder, UrlType } from './../builders/Express'
import * as Express from 'express'

module Route {

    export function Index(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
        res.send('Hello World!')
    }

}

let router = new RouterBuilder('/')
router.addRoute(UrlType.GET, '/', Route.Index)

export const indexRouter = router