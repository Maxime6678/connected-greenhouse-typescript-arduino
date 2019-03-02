import { RouterBuilder, UrlType } from './../commons/Express'
import { haveError, debugPrinc, redisClient } from '../App'
import { getHourSelect, getDaySelect, getPartList } from '../utils/Parser'

import * as Express from 'express'
import * as passport from 'passport'
import * as dateFormat from 'dateformat'

module Route {

    export function Index(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
        let successMessage = req.flash('successMessage')
        getPartList((data) => {
            res.render('panel', {
                successMessage: successMessage[0] ? successMessage[0] : undefined,
                errorMessage: haveError ? 'Une alerte ou plusieurs alertes ont été détectés, merci de vous rendre dans la section "Alertes"' : undefined,
                compartmentList: data
            })
        })
    }

    export function ChangePost(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
        if (!req.query.typeID) return res.redirect('/')
        if (!req.query.compartment) return res.redirect('/')

        redisClient.get('_compartment', (err: Error, data: string) => {
            let parse = data == null || data === undefined ? [] : JSON.parse(data)
            parse[req.query.compartment - 1].typeID = req.query.typeID
            redisClient.set('_compartment', JSON.stringify(parse))
            req.flash('successMessage', 'Changement effectué !')
            return res.redirect('/')
        })
    }

    export function Login(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
        res.render('login')
    }

    export function Chart(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
        res.render('chart', {
            actualDate: dateFormat(new Date(), 'ddmmyy'),
            actualHour: parseInt(dateFormat(new Date(), 'HH')) - 1,
            actualLimite: 2,
            hourSelect: getHourSelect(),
            daySelect: getDaySelect()
        })
    }

    export function LoginPost(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
        passport.authenticate('local', function (err, user, info) {
            if (err) {
                return next(err)
            }
            if (!user) {
                return res.render('login', { errorMessage: 'Mot de passe incorrect!' })
            }
            req.login(user, loginErr => {
                req.flash('successMessage', 'Vous êtes bien connecté !')
                return res.redirect('/')
            })
        })(req, res, next)
    }

}

let router = new RouterBuilder('/')
router.addRoute(UrlType.GET, '/', Route.Index, require('connect-ensure-login').ensureLoggedIn())
router.addRoute(UrlType.GET, '/change', Route.ChangePost, require('connect-ensure-login').ensureLoggedIn())
router.addRoute(UrlType.GET, '/chart', Route.Chart, require('connect-ensure-login').ensureLoggedIn())
router.addRoute(UrlType.GET, '/login', Route.Login)
router.addRoute(UrlType.POST, '/login', Route.LoginPost)

export const indexRouter = router