import * as Express from 'express'

export abstract class ExpressBuilder {

    public readonly app: Express.Application
    public readonly port: number

    constructor(port: number, listen: boolean) {
        this.port = port
        this.app = Express()
        this.registerLib()
        this.registerRouter()
        if (listen) this.app.listen(this.port, () => this.onListen())
    }

    public listen(): void {
        this.app.listen(this.port, () => this.onListen())
    }

    public abstract onListen(): void
    public abstract registerLib(): void
    public abstract registerRouter(): void

}

export enum UrlType {
    GET, POST
}

export class RouterBuilder {

    public readonly router: Express.Router
    public readonly url: string

    constructor(url: string) {
        this.router = Express.Router()
        this.url = url
    }

    public addRoute(type: UrlType, url: string, route: any, passport?: any) {
        switch (type) {
            case UrlType.GET:
                if (!passport) this.router.get(url, route)
                if (passport) this.router.get(url, passport, route)
                break
            case UrlType.POST:
                if (!passport) this.router.post(url, route)
                if (passport) this.router.post(url, passport, route)
                break
        }
    }

}