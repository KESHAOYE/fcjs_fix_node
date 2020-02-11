const express = require('express')
const http = require('request')
const queryString = require('querystring')
const client = require('../../util/redis')
const xml = require('xml2js')
const reg = require('../../util/reg')
const regs = new reg()
let app = express()

app.post('/GET', (req, res, next) => {
    let { phone } = req.body
    console.log(phone);
    regs.checkphonenumber(phone, (data) => {
        if (data) {
            res.json({
                code: 600,
                message: data
            })
            res.end()
        }
    })
    let v = Math.round(Math.random() * (9999 - 1000 + 1) + 1000)
    let time = Math.round(new Date().getTime() / 1000) + 60 * 3
    client.hmset(`VP${phone}`, {
        V: v,
        time: time
    })
    let querydata = queryString.stringify({
        action: 'send',
        userid: '7530',
        account: 'tebicom',
        password: 'tebicom123',
        content: `【福城建设】: 尊敬的用户，您的验证码是:${v}, 该验证码有效期3分钟，请不要泄露给他人！`,
        mobile: `${phone}`
    })
    let option = {
        url: `http://sms.37037.com/sms.aspx?${querydata}`
    }
    var xmls = new xml.Parser({ explicitArray: false, ignoreAttrs: true });
    http(option, (err, re, body) => {
        xmls.parseString(body, (err, data) => {
            data = data.returnsms
            if (data.returnstatus == 'Success') {
                res.json({
                    code: 200,
                    message: '短信验证码获取成功'
                })
            } else {
                res.json({
                    code: 600,
                    message: data.message
                })
            }
        })
    })
})

app.post('/CHECK', async(req, res, next) => {
    let { v, phone } = req.body
    let time = 0
    let fv = 0
    await new Promise(function(resolve, reject) {
        client.hget(`VP${phone}`, 'time', function(err, value) {
            if (!err) {
                resolve(value)
            } else {
                reject(err)
            }
        })
    }).then(data => { time = data })
    await new Promise(function(resolve, reject) {
        client.hget(`VP${phone}`, 'V', function(err, value) {
            if (!err) {
                resolve(value)
            } else {
                reject(err)
            }
        })
    }).then(data => {
        fv = data
    })
    if (Math.round(time - new Date().getTime() / 1000) >= 0) {
        v = parseInt(v)
        if (v == fv) {
            res.json({
                code: 200,
                message: '验证成功'
            })
        } else {
            res.json({
                code: 600,
                message: '验证码错误'
            })
        }
    } else {
        res.json({
            code: 600,
            message: '验证码过期,请重新获取'
        })
    }
})

module.exports = app