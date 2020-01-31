const express = require("express");
const mysql = require('../../util/db')
const app = express();
const token = require('../../util/token')
const tokens = new token()
const uuid = require('node-uuid')
const img = require('../../util/img')
const imgutil = new img()
const time = require('../../util/time')

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

app.use('/GETBRANDS',(req,res,next)=>{
  let {brandname, isfix, page, pageSize} = req.body
  let i ={
      0: '1',
      undefined: '1',
      1: `isfix = '1'`,
      2: `isfix = '0'`,
  }[isfix]
  let start = (page-1)*pageSize
  let sql = brandname == ''? `select * from brandinfo where ${i} limit ${start},${pageSize*page}; ` : `select * from brandinfo where ${i} and brandname like '%${brandname}%' or brandename like '%${brandname}%' limit ${start},${pageSize*page}`
  let sq = brandname == ''? `select count(*) as count from brandinfo where ${i}; ` : `select count(*) as count from brandinfo where ${i} and brandname like '%${brandname}%' or brandename like '%${brandname}%'`
  mysql(sql)
    .then(da=>{
        mysql(sq).then(data=>{
          res.json({
            code:200,
            count: JSON.parse(JSON.stringify(data))[0].count,
            info: da
        })
        })
    })
  .catch(err=>{
      res.json({
          code: 600,
          message: err
      })
  })
})

// 根据Id获取品牌信息
app.use('/GETBRANDBYID', (req,res,next)=>{
    let {brandid} = req.body
    let sql = `select * from brandinfo where brandid = ${brandid}`
    mysql(sql)
        .then(data => {
            data = JSON.parse(JSON.stringify(data))[0]
            data.brandimg= data.brandimg==''? '': imgutil.imgtobase(`./public${data.brandimg}`)
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
// 添加品牌
app.use('/ADDBRAND',(req,res,next)=>{
    let { brandname, brandename, brandimg, isfix} = req.body
        let _t_ = req.headers.authorization
        let imgs = imgutil.saveImg('/brand/',brandimg)
        let roleid = req.headers.roleid
        let phone = req.headers.phone
        let t = tokens.checkAdminToken(phone, _t_,roleid)
        t.then(data => {
                let sql = `insert into brandinfo(brandid,brandname,brandename,brandimg,isfix) values('${uuid.v1()}','${brandname}','${brandename}','${imgs}','${isfix}')`
                mysql(sql).then(data => {
                        res.json({
                            code: 200,
                            message: '添加成功'
                        })
                    })
                    .catch(err => {
                        res.json({
                            code: 600,
                            message: err
                        })
                    })
            })
            .catch(err => {
                res.json({
                    code: 601,
                    message: '你没有权限' + err
                })
            })
})

// 修改品牌
app.use('/UPDATEBRAND',(req,res,next)=>{
    let { brandid, brandname, brandename, brandimg, isfix } = req.body
    let _t_ = req.headers.authorization
    let imgs = imgutil.saveImg('/brand/',brandimg)
    let roleid = req.headers.roleid
    let phone = req.headers.phone
let t = tokens.checkAdminToken(phone, _t_,roleid)
    const ct = time.getTime()
        t.then(data => {
                let sql = `update brandinfo set brandname = '${brandname}', brandename = '${brandename}', brandimg = '${imgs}' , isfix = '${isfix}' where brandid = '${brandid}'`
                mysql(sql).then(data => {
                        res.json({
                            code: 200,
                            message: '修改成功'
                        })
                    })
                    .catch(err => {
                        res.json({
                            code: 600,
                            message: err
                        })
                    })
            })
            .catch(err => {
                res.json({
                    code: 601,
                    message: '你没有权限' + err
                })
            })    
})

app.use('/DELETEBRAND', (req, res, next) => {
    let { brandid } = req.body
    let _t_ = req.headers.authorization
    let roleid = req.headers.roleid
    let phone =req.headers.phone
    let t = tokens.checkAdminToken(phone, _t_,roleid)
    t.then(data => {
            let sql = `delete from brandinfo where brandid = '${brandid}'`
            mysql(sql).then(data => {
                    res.json({
                        code: 200,
                        message: '删除成功'
                    })
                })
                .catch(err => {
                    res.json({
                        code: 600,
                        message: err
                    })
                })
        })
        .catch(err => {
            res.json({
                code: 601,
                message: '你没有权限' + err
            })
        })
})

module.exports = app