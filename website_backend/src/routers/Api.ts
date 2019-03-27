import { RouterBuilder, UrlType } from './../commons/Express'
import { generateId, createRequest } from '../utils/Request'
import { getValuesGraph } from '../utils/Parser'

import * as Express from 'express'

module Route {

    export async function InfoCapteur(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
        if (req.isUnauthenticated()) return res.status(400).send({ status: 'error', code: 400, message: 'Unauthorized' })
        if (!req.params.capteur) return res.status(400).send({ status: 'error', code: 400, message: 'Capteur was not provided!' })

        createRequest(req.params.capteur, generateId()).then((result) => {
            res.status(200).send({ status: 'success', value: result })
        })
    }

    export async function InfoGraph(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
        //if (req.isUnauthenticated()) return res.status(400).send({ status: 'error', code: 400, message: 'Unauthorized' })
        if (!req.params.day) return res.status(400).send({ status: 'error', code: 400, message: 'Date was not provided!' })
        if (!req.params.hour) return res.status(400).send({ status: 'error', code: 400, message: 'Hour was not provided!' })
        if (!req.params.limite) return res.status(400).send({ status: 'error', code: 400, message: 'Limite was not provided!' })

        getValuesGraph(req.params.day, parseInt(req.params.hour), parseInt(req.params.limite), (data) => {
            res.status(200).send(data)
        })
    }

}

let router = new RouterBuilder('/api/')
router.addRoute(UrlType.GET, '/info/:capteur', Route.InfoCapteur)
router.addRoute(UrlType.GET, '/graph/:day/:hour/:limite', Route.InfoGraph)

export const apiRouter = router