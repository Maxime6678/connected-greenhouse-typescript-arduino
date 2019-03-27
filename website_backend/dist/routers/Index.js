"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Express_1 = require("./../commons/Express");
const App_1 = require("../App");
const Parser_1 = require("../utils/Parser");
const passport_1 = __importDefault(require("passport"));
const dateformat_1 = __importDefault(require("dateformat"));
var Route;
(function (Route) {
    function Index(req, res, next) {
        let successMessage = req.flash('successMessage');
        Parser_1.getPartList((data) => {
            res.render('panel', {
                successMessage: successMessage[0] ? successMessage[0] : undefined,
                errorMessage: App_1.haveError ? 'Une alerte ou plusieurs alertes ont été détectés, merci de vous rendre dans la section "Alertes"' : undefined,
                compartmentList: data
            });
        });
    }
    Route.Index = Index;
    function ChangePost(req, res, next) {
        if (!req.query.typeID)
            return res.redirect('/');
        if (!req.query.compartment)
            return res.redirect('/');
        App_1.redisClient.get('_compartment', (err, data) => {
            let parse = data == null || data === undefined ? [] : JSON.parse(data);
            parse[req.query.compartment - 1].typeID = req.query.typeID;
            App_1.redisClient.set('_compartment', JSON.stringify(parse), () => null);
            req.flash('successMessage', 'Changement effectué !');
            return res.redirect('/');
        });
    }
    Route.ChangePost = ChangePost;
    function Login(req, res, next) {
        res.render('login');
    }
    Route.Login = Login;
    function Chart(req, res, next) {
        res.render('chart', {
            actualDate: dateformat_1.default(new Date(), 'ddmmyy'),
            actualHour: parseInt(dateformat_1.default(new Date(), 'HH')) - 1,
            actualLimite: 2,
            hourSelect: Parser_1.getHourSelect(),
            daySelect: Parser_1.getDaySelect()
        });
    }
    Route.Chart = Chart;
    function LoginPost(req, res, next) {
        passport_1.default.authenticate('local', function (err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.render('login', { errorMessage: 'Mot de passe incorrect!' });
            }
            req.login(user, loginErr => {
                req.flash('successMessage', 'Vous êtes bien connecté !');
                return res.redirect('/');
            });
        })(req, res, next);
    }
    Route.LoginPost = LoginPost;
})(Route || (Route = {}));
let router = new Express_1.RouterBuilder('/');
router.addRoute(Express_1.UrlType.GET, '/', Route.Index, require('connect-ensure-login').ensureLoggedIn());
router.addRoute(Express_1.UrlType.GET, '/change', Route.ChangePost, require('connect-ensure-login').ensureLoggedIn());
router.addRoute(Express_1.UrlType.GET, '/chart', Route.Chart, require('connect-ensure-login').ensureLoggedIn());
router.addRoute(Express_1.UrlType.GET, '/login', Route.Login);
router.addRoute(Express_1.UrlType.POST, '/login', Route.LoginPost);
exports.indexRouter = router;
