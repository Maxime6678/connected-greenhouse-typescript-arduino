import { RedisBuilder } from '../commons/Redis'
import { createRequest, generateId } from './Request'

import * as dateFormat from 'dateformat'
import { debugRedis } from '../App';

export class Control {

    public instance: RedisBuilder
    public readonly refresh: number

    constructor(instance: RedisBuilder, refresh: number) {
        this.instance = instance
        this.refresh = refresh
        let interval = setInterval(() => {
            if (dateFormat(new Date(), 'ss') == '59') {
                setInterval(() => this.check(), refresh)
                clearInterval(interval)
            }
        }, 100)
    }

    private check(): void {
        createRequest('all', generateId()).then((data: any) => {
            let parse = data.split('@') // 0 = temp, 1 = hum, 2 = lux
            this.saveData(data)

            if (parse[0] > '20') {
                debugRedis('TEMP ALERT')
            }
        })
    }

    private saveData(data: string): void {
        this.haveDate((err, res) => {
            if (!res) this.createDate()
            this.getDate((err, res) => {
                let parse = JSON.parse(res)
                let newData = {
                    date: dateFormat(new Date(), 'dd"/"mm"/"yyyy hh:MM:ss'),
                    data: data
                }
                parse[dateFormat(new Date(), 'hh:MM:ss')] = newData
                this.instance.set('schedule:' + dateFormat(new Date(), 'ddmmyy'), JSON.stringify(parse))
            })
        })
    }

    private haveDate(callback: (err: Error, res: boolean) => void): void {
        this.instance.get('schedule:' + dateFormat(new Date(), 'ddmmyy'), (err: Error, res: string) => {
            callback(err, res ? true : false)
        })
    }

    private createDate(): void {
        this.instance.set('schedule:' + dateFormat(new Date(), 'ddmmyy'), '{}')
    }

    private getDate(callback: (err: Error, res: string) => void): void {
        this.instance.get('schedule:' + dateFormat(new Date(), 'ddmmyy'), (err: Error, res: string) => {
            callback(err, res)
        })
    }

}