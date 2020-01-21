const express = require("express");
const mysql = require('../../util/db')
const app = express();
const token = require('../../util/token')
const tokens = new token()
const uuid = require('node-uuid')

// 获取全部品牌
app.use('/GETBRAND', (req, res, next) => {
    let sql = `select * from  brandinfo`
    mysql(sql)
        .then(data => {
            res.json({
                code: 200,
                status: true,
                info: data
            })
        })
        .catch(err => {
            res.json({
                code: 600,
                message: err
            })
        })
})

// 获取维修品牌
app.use('/GETFIXBRAND', (req, res, next) => {
    let sql = `select * from  brandinfo where isfix = '1'`
    mysql(sql)
        .then(data => {
            res.json({
                code: 200,
                status: true,
                info: data
            })
        })
        .catch(err => {
            res.json({
                code: 600,
                message: err
            })
        })
})

module.exports = app