import { RouterBuilder, UrlType } from './../commons/Express'
import { generateId, createRequest } from '../utils/Request'

import * as Express from 'express'

module Route {

    export function Index(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
        let successMessage = req.flash('successMessage')
        res.render('panel', { successMessage: successMessage[0] ? successMessage[0] : undefined })
    }

    export function InfoCapteur(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
        if (req.isUnauthenticated()) return res.status(400).send({ status: 'error', code: 400, message: 'Unauthorized' })
        if (!req.params.capteur) return res.status(400).send({ status: 'error', code: 400, message: 'Capteur was not provided!' })
        let id = generateId()
        createRequest('info', id, req.params.capteur).then((result) => {
            res.status(200).send({ status: 'success', value: result })
        })
    }

}

let router = new RouterBuilder('/api/')
router.addRoute(UrlType.GET, '/info/:capteur', Route.InfoCapteur)

export const apiRouter = router