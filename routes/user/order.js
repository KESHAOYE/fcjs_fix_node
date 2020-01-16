const express = require('express')
const mysql = require('mysql')
const token = require('../../util/token')
const app = express()
const tokens = new token()

app.use('/GETORDERCOUNT',async (req,res,next)=>{
    // 获取token
    let {authorization} = req.headers
    let {phone} = req.body
    let token = await tokens.checkToken(phone,authorization)
})

module.exports = app