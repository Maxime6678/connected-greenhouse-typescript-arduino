import { RouterBuilder, UrlType, asyncMiddleware } from './../commons/Express'
import { generateId, createRequest } from '../utils/Request'

import * as Express from 'express'

module Route {

    export async function InfoCapteur(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
        if (req.isUnauthenticated()) return res.status(400).send({ status: 'error', code: 400, message: 'Unauthorized' })
        if (!req.params.capteur) return res.status(400).send({ status: 'error', code: 400, message: 'Capteur was not provided!' })

        createRequest(req.params.capteur, generateId()).then((result) => {
            res.status(200).send({ status: 'success', value: result })
        })
    }

}

let router = new RouterBuilder('/api/')
router.addRoute(UrlType.GET, '/info/:capteur', asyncMiddleware(Route.InfoCapteur))

export const apiRouter = router