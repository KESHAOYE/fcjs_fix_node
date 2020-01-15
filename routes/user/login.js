const express = require('express')
const mysql = require('../../util/db')
const token = require('../../util/token')
var utility = require("utility");
const time = require('../../util/time')
let tokens = new token()
let app = express()

async function existUser(phone) {
    let sql = `select count(1) as count from userinfo where phone = ${phone}`
    let query = await mysql(sql)
    if (query[0].count > 0) {
        return Promise.resolve(403)
    } else {
        return Promise.resolve(200)
    }
}

async function existId(id) {
    let sql = `select count(1) as count from userinfo where user_id = ${id}`
    let query = await mysql(sql)
    if (query[0].count > 0) {
        return Promise.resolve(403)
    } else {
        return Promise.resolve(200)
    }
}

// 通过账号密码登录
app.use('/LOGINU', async(req, res, next) => {
    let {
        phone,
        password
    } = req.body
    let passwords = utility.md5(password)
    let code = await existUser(phone)
    if (code === 200) {
        res.json({
            code: 600,
            message: '不存在此用户'
        })
    } else {
        //插入语句
        let sql = `select count(1) as count from userinfo where phone = '${phone}' and password = '${passwords}'`
        let utokens = tokens.newToken(phone)
        mysql(sql)
            .then(data => {
                if (data[0].count > 0) {
                    res.json({
                        code: 200,
                        message: '登录成功',
                        _T_: utokens
                    })
                } else {
                    res.json({
                        code: 600,
                        message: '密码错误'
                    })
                }
            })
            .catch(err => {
                console.log(err);
                res.json({
                    code: 600,
                    message: err
                })
            })
    }
})

app.use('/GETUSERINFO', async(req, res, next) => {
    console.log(req.header)
    let { id, phone } = req.body
    console.log(id, phone)
    let code = id ? await existId(id) : await existUser(phone)
    console.log(code)
    if (code === 403) {
        let sql = id ? `select * from userinfo where user_id = '${id}'` : `select * from userinfo where phone = '${phone}'`
        console.log(sql)
        mysql(sql)
            .then(data => {
                console.log(data)
                let d = data[0]
                const result = {
                    userid: d.user_id,
                    username: d.username,
                    sex: { 1: '男', 2: '女' }[d.sex],
                    id: d.id,
                    name: d.name,
                    phone: d.phone,
                    birth: d.birthday,
                    headimg: d.headimg === null ? 'http://localhost:3000/public/user/default.png' : `http://localhost:3000${d.headimg}`,
                    isname: { 1: true, 2: false }[d.isname]
                }
                res.json({
                    code: 200,
                    status: true,
                    info: result
                })
            })
            .catch(err => {
                res.json({
                    code: 600,
                    message: err
                })
            })
    } else {
        res.json({
            code: 600,
            message: '不存在此用户'
        })
    }
})

module.exports = app