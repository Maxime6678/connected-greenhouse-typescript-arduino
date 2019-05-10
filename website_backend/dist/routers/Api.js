"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Express_1 = require("./../commons/Express");
const Request_1 = require("../utils/Request");
const Parser_1 = require("../utils/Parser");
var Route;
(function (Route) {
    async function InfoCapteur(req, res, next) {
        if (req.isUnauthenticated())
            return res.status(400).send({ status: 'error', code: 400, message: 'Unauthorized' });
        if (!req.params.capteur)
            return res.status(400).send({ status: 'error', code: 400, message: 'Capteur was not provided!' });
        Request_1.createRequest(req.params.capteur, Request_1.generateId()).then((result) => {
            console.log(result);
            res.status(200).send({ status: 'success', value: result });
        });
    }
    Route.InfoCapteur = InfoCapteur;
    async function InfoGraph(req, res, next) {
        if (req.isUnauthenticated())
            return res.status(400).send({ status: 'error', code: 400, message: 'Unauthorized' });
        if (!req.params.day)
            return res.status(400).send({ status: 'error', code: 400, message: 'Date was not provided!' });
        if (!req.params.hour)
            return res.status(400).send({ status: 'error', code: 400, message: 'Hour was not provided!' });
        if (!req.params.limite)
            return res.status(400).send({ status: 'error', code: 400, message: 'Limite was not provided!' });
        Parser_1.getValuesGraph(req.params.day, parseInt(req.params.hour), parseInt(req.params.limite), (data) => {
            res.status(200).send(data);
        });
    }
    Route.InfoGraph = InfoGraph;
    async function DoThing(req, res, next) {
        if (req.isUnauthenticated())
            return res.status(400).send({ status: 'error', code: 400, message: 'Unauthorized' });
        if (!req.params.action)
            return res.status(400).send({ status: 'error', code: 400, message: 'Date was not provided!' });
        if (!req.params.opt)
            return res.status(400).send({ status: 'error', code: 400, message: 'Hour was not provided!' });
        Request_1.createRequestDo(req.params.action, req.params.opt, Request_1.generateId());
        res.status(200).send({ status: 'success' });
    }
    Route.DoThing = DoThing;
})(Route || (Route = {}));
let router = new Express_1.RouterBuilder('/api/');
router.addRoute(Express_1.UrlType.GET, '/info/:capteur', Route.InfoCapteur);
router.addRoute(Express_1.UrlType.GET, '/graph/:day/:hour/:limite', Route.InfoGraph);
router.addRoute(Express_1.UrlType.GET, '/do/:action/:opt', Route.DoThing);
exports.apiRouter = router;
