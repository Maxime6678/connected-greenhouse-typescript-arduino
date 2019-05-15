import { RedisBuilder } from '../commons/Redis'
import { createRequest, generateId } from './Request'

import dateFormat from 'dateformat'
import { debugRedis } from '../App';

export class Control {

    public instance: RedisBuilder
    public readonly refresh: number

    constructor(instance: RedisBuilder, refresh: number) {
        this.instance = instance
        this.refresh = refresh
        let isPast = true
        setInterval(() => {
            let minute = parseInt(dateFormat(new Date(), 'MM').split('')[dateFormat(new Date(), 'MM').split('').length - 1])
            if (minute % 5 == 0) {
                let p = minute == 0 ? true : false
                if (p != isPast) {
                    isPast = !isPast
                    this.check()
                }
            }
        }, this.refresh)
    }

    private check(): void {
        createRequest('all', generateId()).then((data: any) => {
            let parse = data.split('@') // 0 = temp, 1 = hum, 2 = lux
            this.saveData(data)

            if (parse[0] < '18' || parse[0] < '25') {
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
                    date: dateFormat(new Date(), 'UTC:yyyy-mm-dd"T"HH:MM:ss"Z"'),
                    data: data
                }
                parse.push(newData)
                this.instance.set('schedule:' + dateFormat(new Date(), 'ddmmyy'), JSON.stringify(parse), () => null)
            })
        })
    }

    private haveDate(callback: (err: Error, res: boolean) => void): void {
        this.instance.get('schedule:' + dateFormat(new Date(), 'ddmmyy'), (err: Error, res: string | null) => {
            callback(err, res ? true : false)
        })
    }

    private createDate(): void {
        this.instance.set('schedule:' + dateFormat(new Date(), 'ddmmyy'), '[]', () => null)
    }

    private getDate(callback: (err: Error, res: string) => void): void {
        this.instance.get('schedule:' + dateFormat(new Date(), 'ddmmyy'), (err: Error, res: string | null) => {
            callback(err, String(res))
        })
    }

}