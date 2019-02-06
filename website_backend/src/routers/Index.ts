import { RouterBuilder, UrlType } from './../commons/Express'

import * as Express from 'express'
import * as passport from 'passport'
import { haveError } from '../App';

module Route {

    export function Index(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
        let successMessage = req.flash('successMessage')
        res.render('panel', { successMessage: successMessage[0] ? successMessage[0] : undefined, errorMessage: haveError ? 'Une alerte ou plusieurs alertes ont été détectés, merci de vous rendre dans la section "Alertes"' : undefined })
    }

    export function Login(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
        res.render('login')
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
router.addRoute(UrlType.GET, '/login', Route.Login)
router.addRoute(UrlType.POST, '/login', Route.LoginPost)

export const indexRouter = router