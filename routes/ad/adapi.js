const express = require("express");
const mysql = require('../../util/db')
const img = require('../../util/img')
const app = express();
const imgutil = new img()
const token = require('../../util/token')
let tokens = new token()
const time = require('../../util/time')

//客户域

/**通过广告位获取广告 */
app.use('/GETAD', (req, res, next) => {
  let {adid} =  req.body
  let sql = `select * from adinfo where adid = ${adid}`
  mysql(sql)
  .then(data=>{
      res.json({
        code: 200,
        status: true,
        adid: adid,
        info: data
      })
  })
  .catch(err=>{
      res.json({
        code: 600,
        status: false,
        message: err
      })
  })
})
// 管理员域
// 添加广告
app.use('/ADDAD',(req,res,next)=>{
  let {adid,adimg,startdue,overdue,priority,shopid,createMan,phone} = req.body
  let _t_ = req.headers.authorization
  let imgs = imgutil.saveImg(adimg)
  let t = tokens.checkToken(phone,_t_)
  const ct = time.getTime()
  t.then(data=>{
    let sql = `insert into adinfo(adid,adimg,shopid,startdue,overdue,priority,create_man,create_date) values(${adid},${img},${shopid},${startdue},${overdue},${priority},${createMan},${ct})`
    mysql(sql).then(data=>{
      res.json({
          code: 200,
          message: '添加成功'
      })
    })
    .catch(err=>{
        res.json({
          code: 600,
          message: err
        })
    })
  })
  .catch(err=>{
      res.json({
        code: 600,
        message: '你没有权限' + err
      })
  })
})
//更改广告
app.use('/UPDATEAD',(req,res,next)=>{
    let {id,adid,adimg,startdue,overdue,priority,shopid,phone} = req.body
    let _t_ = req.headers.authorization
    let imgs = imgutil.saveImg(adimg)
    let t = tokens.checkToken(phone,_t_)
    const ct = time.getTime()
    t.then(data=>{
      let sql = `update adinfo set adid = ${adid}, adimg = ${imgs}, shopid = ${shopid} , startdue = ${startdue} , overdue = ${overdue} , priority = ${priority} where id = ${id}`
      mysql(sql).then(data=>{
        res.json({
            code: 200,
            message: '修改成功'
        })
      })
      .catch(err=>{
          res.json({
            code: 600,
            message: err
          })
      })
    })
    .catch(err=>{
        res.json({
          code: 600,
          message: '你没有权限' + err
        })
    })
})
// 删除广告
app.use('/DELETEAD',(req,res,next)=>{
  let {id} = req.body
  let _t_ = req.headers.authorization
  let t = tokens.checkToken(phone,_t_)
  t.then(data=>{
    let sql = `update adinfo set isshow = ${0} where id = ${id}`
    mysql(sql).then(data=>{
      res.json({
          code: 200,
          message: '删除成功'
      })
    })
    .catch(err=>{
        res.json({
          code: 600,
          message: err
        })
    })
  })
  .catch(err=>{
      res.json({
        code: 600,
        message: '你没有权限' + err
      })
  })
})

 module.exports = app;