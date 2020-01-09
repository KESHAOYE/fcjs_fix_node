const express = require('express')
const mysql = require('../../util/db')
const token = require('../../util/token')
const nodersa = require('node-rsa')
const time = require('../../util/time')
let app = express()

let key = new nodersa({ b: 512 })

function existUser (phone) {
  let sql = `select count(1) as count from userinfo where phone = ${phone}`
  return new Promise((resolve,reject)=>{
  mysql.query(sql, '', function(err, data, fields) {
    if(data[0].count>0){
      // 存在用户
      mysql.end()
      resolve(403)
    } else {
      mysql.end()
      resolve(200)
    }
 })
}) 
}

// 通过账号密码登录
app.use('/LOGINU', async (req, res, next) => {
    let { phone, password } = req.query
    let passwords = key.encrypt(password, 'base64')
    let regisiterTime = time.getTime()
    let userId = time.nowTimeStamp()+Math.floor(Math.random()*10000+1)
    let code = await existUser(phone)
    if(code === 403) {
      res.json({
        code: 600,
        message: '已经存在相同的手机号,请直接前往登录'
      })
    } else {
    //插入语句
    let sql = `insert into userinfo(user_id,phone,password,regisitertime) values('${userId}','${phone}','${passwords}','${regisiterTime}');`
    mysql.query(sql, function(err, data, fields) {
      if(err){
        res.json({
          code: 600,
          message: err
        })
      } else {
          console.log(fields)
          res.json({
            code: 200,
            message: '注册成功',
            userId: userId
          })
      }
    })
  }
})

module.exports = app