import * as dateFormat from 'dateformat'
import { redisClient } from '../App'

export function getValuesGraph(date: string, hour: number, limite: number, callback: (res: any) => void): any {
    redisClient.get('schedule:' + date, (err: Error, res: string) => {
        let data = res == null || res === undefined ? [] : JSON.parse(res)
        let values = []

        if (hour + limite < 24) {
            for (let i = 0; i < limite; i++) {
                for (let j = 0; j < 6; j++) {
                    let val1, val2

                    // For XX:X0
                    val1 = data.filter(x => dateFormat(new Date(x.date), 'HH":"MM') === hour + i + ':' + j + '0')[0]
                    if (!val1) val1 = {
                        date: null,
                        data: '0@0@0'
                    }

                    // For XX:X5
                    val2 = data.filter(x => dateFormat(new Date(x.date), 'HH":"MM') === hour + i + ':' + j + '5')[0]
                    if (!val2) val2 = {
                        date: null,
                        data: '0@0@0'
                    }

                    values.push({
                        x: hour + i + ':' + j + '0',
                        y: val1.data
                    })
                    values.push({
                        x: hour + i + ':' + j + '5',
                        y: val2.data
                    })
                }
            }

            return callback(values)
        } else {
            let date1 = date,
                date2 = addDay(date)

            redisClient.get('schedule:' + date2, (err: Error, res: string) => {
                let parse = res == null || res === undefined ? [] : JSON.parse(res)
                for (let index in parse) {
                    data.push(parse[index])
                }

                let date1Split = date1.split('')
                let date1Day = date1Split[0] + '' + date1Split[1]

                let date2Split = date2.split('')
                let date2Day = date2Split[0] + '' + date2Split[1]

                // Day 1
                for (let i = 0; i < 24 - hour; i++) {
                    for (let j = 0; j < 6; j++) {
                        let val1, val2

                        // For XX:X0
                        val1 = data.filter(x => dateFormat(new Date(x.date), 'dd"-"HH":"MM') === date1Day + "-" + (hour + i) + ':' + j + '0')[0]
                        if (!val1) val1 = {
                            date: null,
                            data: 'null@null@null'
                        }

                        // For XX:X5
                        val2 = data.filter(x => dateFormat(new Date(x.date), 'dd"-"HH":"MM') === date1Day + "-" + (hour + i) + ':' + j + '5')[0]
                        if (!val2) val2 = {
                            date: null,
                            data: 'null@null@null'
                        }

                        values.push({
                            x: hour + i + ':' + j + '0',
                            y: val1.data
                        })
                        values.push({
                            x: hour + i + ':' + j + '5',
                            y: val2.data
                        })
                    }
                }

                // Day 2
                for (let i = 0; i < (hour + limite) - 24; i++) {
                    for (let j = 0; j < 6; j++) {
                        let val1, val2

                        // For XX:X0
                        val1 = data.filter(x => dateFormat(new Date(x.date), 'dd"-"HH":"MM') === date2Day + "-" + (i) + ':' + j + '0')[0]
                        if (!val1) val1 = {
                            date: null,
                            data: 'null@null@null'
                        }

                        // For XX:X5
                        val2 = data.filter(x => dateFormat(new Date(x.date), 'dd"-"HH":"MM') === date2Day + "-" + (i) + ':' + j + '5')[0]
                        if (!val2) val2 = {
                            date: null,
                            data: 'null@null@null'
                        }

                        values.push({
                            x: i + ':' + j + '0',
                            y: val1.data
                        })
                        values.push({
                            x: i + ':' + j + '5',
                            y: val2.data
                        })
                    }
                }

                return callback(values)
            })
        }

    })
}

export function getHourSelect(): any {
    let hour = removeHour(parseInt(dateFormat(new Date(), 'HH')))
    let result = []
    if (hour == 0) result.push({ text: '00h', value: '00', isCurrent: true })
    else result.push({ text: '00h', value: '00', isCurrent: false })
    for (let i = 1; i < 24; i++) {
        let is = false
        if (i == hour) is = true
        result.push({ text: i < 10 ? '0' + i + 'h' : i + 'h', value: i < 10 ? '0' + i : i, isCurrent: is })
    }
    return result
}

export function getDaySelect(): any {
    let date = dateFormat(new Date(), 'ddmmyy')
    let result = []
    let split = date.split('')
    result.push({ text: split[0] + split[1] + '/' + split[2] + split[3] + '/20' + split[4] + split[5], value: date, isCurrent: true })
    for (let i = 0; i < 3; i++) {
        date = removeDay(date)
        split = date.split('')
        result.push({ text: split[0] + split[1] + '/' + split[2] + split[3] + '/20' + split[4] + split[5], value: date, isCurrent: false })
    }
    return result
}

export function addDay(date: string) {
    let split = date.split('')

    let day = parseInt(split[0] + '' + split[1])
    let month = parseInt(split[2] + '' + split[3])
    let year = parseInt(split[4] + '' + split[5])
    let max = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1]

    let dayR, monthR

    if (day + 1 <= max) {
        dayR = day + 1 < 10 ? '0' + day + 1 : day + 1
        monthR = month < 10 ? '0' + month : month
    } else {
        dayR = '01'
        if (month + 1 > 12) {
            year++;
            monthR = '01'
        } else monthR = month + 1 < 10 ? '0' + month + 1 : month + 1
    }

    return dayR + '' + monthR + '' + year
}

export function removeDay(date) {
    let split = date.split('')

    let day = parseInt(split[0] + '' + split[1])
    let month = parseInt(split[2] + '' + split[3])
    let year = parseInt(split[4] + '' + split[5])
    let max = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

    let dayR, monthR

    if (day - 1 != 0) {
        dayR = day - 1 < 10 ? '0' + (day - 1) : day - 1
        monthR = month < 10 ? '0' + month : month
    } else {
        if (month - 1 == 0) {
            year--;
            monthR = '12'
        } else {
            monthR = month - 1 < 10 ? '0' + (month - 1) : month - 1
        }
        dayR = max[month - 1]
    }

    return dayR + '' + monthR + '' + year
}

export function removeHour(hour) {
    if (hour - 1 >= 0) return hour - 1
    else return 23
}