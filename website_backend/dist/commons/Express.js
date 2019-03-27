"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
class ExpressBuilder {
    constructor(port, listen) {
        this.port = port;
        this.app = express_1.default();
        this.registerLib();
        this.registerRouter();
        if (listen)
            this.app.listen(this.port, () => this.onListen());
    }
    listen() {
        this.app.listen(this.port, () => this.onListen());
    }
}
exports.ExpressBuilder = ExpressBuilder;
var UrlType;
(function (UrlType) {
    UrlType[UrlType["GET"] = 0] = "GET";
    UrlType[UrlType["POST"] = 1] = "POST";
})(UrlType = exports.UrlType || (exports.UrlType = {}));
class RouterBuilder {
    constructor(url) {
        this.router = express_1.default.Router();
        this.url = url;
    }
    addRoute(type, url, route, passport) {
        switch (type) {
            case UrlType.GET:
                if (!passport)
                    this.router.get(url, route);
                if (passport)
                    this.router.get(url, passport, route);
                break;
            case UrlType.POST:
                if (!passport)
                    this.router.post(url, route);
                if (passport)
                    this.router.post(url, passport, route);
                break;
        }
    }
}
exports.RouterBuilder = RouterBuilder;
