const express = require('express')
const mysql = require('../../util/db')
const token = require('../../util/token')
const nodersa = require('node-rsa')
const time = require('../../util/time')
let app = express()

let key = new nodersa({
    b: 512
})

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
    let sql = `select count(1) as count from userinfo where id = ${id}`
    let query = await mysql(sql)
    if (query[0].count > 0) {
        return Promise.resolve(403)
    } else {
        return Promise.resolve(200)
    }
}
// 注册
app.use('/REGISTERNEW', async(req, res, next) => {
    let {
        name,
        phone,
        password
    } = req.body
    console.log(req.body)
    let passwords = key.encrypt(password, 'base64')
    let regisiterTime = time.getTime()
    let userId = time.nowTimeStamp() + Math.floor(Math.random() * 10000 + 1)
    let code = await existUser(phone)
    if (code === 403) {
        res.json({
            code: 600,
            message: '已经存在相同的手机号,请直接前往登录'
        })
    } else {
        //插入语句
        let sql = `insert into userinfo(user_id,username,phone,password,regisitertime) values('${userId}','${name}','${phone}','${passwords}','${regisiterTime}');`
        let query = mysql(sql)
            .then(data => {
                res.json({
                    code: 200,
                    message: '注册成功',
                    userId: userId
                })
            })
            .catch(err => {
                res.json({
                    code: 600,
                    message: err
                })
            })
    }
})

// 资料补齐
app.use('/FULLINFO', async(req, res, next) => {
    console.log(req.body)
})

module.exports = app