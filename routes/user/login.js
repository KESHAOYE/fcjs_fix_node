const express = require('express')
const mysql = require('../../util/db')
const token = require('../../util/token')
const nodersa = require('node-rsa')
let app = express()

let key = new nodersa({ b: 512 })

// 通过账号密码登录
app.use('/LOGINU', (req, res, next) => {
    let { username, password } = req.body
    console.log(req.params, req.body, req.query, req)
    let passwords = key.encrypt(password, 'base64')
    let sql = `insert into userinfo(phone,password) values(${username},${passwords})`
    mysql(sql, function(err, data, fields) {
        console.log(data, fields)
    })
})

module.exports = app