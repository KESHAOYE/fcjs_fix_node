const express = require('express')
const mysql = require('../../util/db')
const token = require('../../util/token')
var utility = require("utility");
const time = require('../../util/time')
let tokens = new token()
const regs = require('../../util/reg')
const reg = new regs()
let app = express()

// 仅后台使用
app.use('/GETADMINSTATE',(req,res,next)=>{
    let {phone} = req.body
    let sql = `DROP PROCEDURE IF EXISTS roleinfo;
    CREATE PROCEDURE roleinfo()
    BEGIN
    DECLARE rid INT(11);
    DECLARE userid varchar(255);
    SELECT user_id INTO userid from userinfo where phone = '${phone}';
    SELECT roleid INTO rid FROM roleuser where userid = userid;
    SELECT * FROM role where id = rid;
    END;
    CALL roleinfo()`
    mysql(sql)
    .then(data=>{
    data=JSON.parse(JSON.stringify(data[2]))
      if(data[0].roleid > 0){
       res.json({
           code: 200,
           status:true,
           info: data
       })
      } else {
        res.json({
          code: 201,
          status:false,
          message: '您不是管理员，没有权利登录!'
        })
      }
    })
    .catch(err=>{
       res.json({
           code: 600,
           message: err
       })
    })
  })

  app.use('/GETROUTER',(req,res,next)=>{
    let {userid} = req.body;
    let sql = `select m.id,m.title,m.path,m.icon,m.parentId from menu m,userinfo u,roleuser ru,menu_user mu where m.id = mu.menuid and ru.roleid = mu.roleid and ru.userid = u.user_id and u.user_id = ${userid} order by id asc`
    mysql(sql)
    .then(data=>{
      console.log(data)
      let a = JSON.parse(JSON.stringify(data))
      let b = []
      a.forEach(el=>{
          if(el.parentId == null){
              b.push({
                  menuid: el.id,
                  path: el.path,
                  title: el.title,
                  icon: el.icon
              })
          } else {
              let index = b.findIndex((e,index)=> el.parentId == e.menuid)
              if(!b[index].children) {b[index].children=[]}
              b[index].children.push({
                  path:el.path,
                  title:el.title,
                  icon:el.icon
              })
          }
          console.log(b)
      })
      res.json({
        code: 200,
        info: b
      })
    })
    .catch(err=>{
      res.json({
        code: 600,
        message: err
      })
    })
  })

  module.exports = app