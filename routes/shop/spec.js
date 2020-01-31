const express = require("express");
const mysql = require('../../util/db')
const app = express();
const token = require('../../util/token')
const tokens =new token()
const time = require('../../util/time')
const uuid = require('node-uuid')

// 管理sku,spu
app.use('/GETSPECS',(req,res,next)=>{
  let {specName, page, pageSize} = req.body
  let start = (page-1)*pageSize
  let sql = specName == ''? `select * from shop_spec limit ${start},${pageSize*page}` : `select * from shop_spec where spec_name like '%${specName}%' limit ${start},${pageSize*page}`
  let sq = specName == ''? `select count(*) as count from shop_spec; ` : `select count(*) as count from shop_spec where spec_name like '%${specName}%'`
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

app.use('/GETSPECBYID',(req,res,next)=>{
    let {specId} = req.body
    let sql = `select * from shop_spec where spec_id = '${specId}'`
      mysql(sql)
      .then(da=>{
            res.json({
              code:200,
              info: da
          })
      })
    .catch(err=>{
        res.json({
            code: 600,
            message: err
        })
    })
  
  })

// 添加规格名称
app.use('/ADDSPEC',(req,res,next)=>{
    let {
        specName,
        specRes
    } = req.body
    let _t_ = req.headers.authorization
    let roleid = req.headers.roleid
    let phone = req.headers.phone
    let t = tokens.checkAdminToken(phone, _t_,roleid)
    const ct = time.getTime()
    t.then(data => {
        let sql = `insert into shop_spec(spec_id,spec_name,spec_des,createTime) values('${uuid.v1()}','${specName}','${specRes}','${ct}')`
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

// 修改规格

app.use('/UPDATESPEC', (req, res, next) => {
    let {
        id,
        specName,
        specRes
    } = req.body
    let _t_ = req.headers.authorization
    let roleid = req.headers.roleid
    let phone = req.headers.phone
    let t = tokens.checkAdminToken(phone, _t_,roleid)
    t.then(data => {
            let sql = `update shop_spec set spec_name= '${specName}',spec_des = '${specRes}' where id = '${id}'`
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

app.use('/DELETESPEC', (req, res, next) => {
    let { specId } = req.body
    let _t_ = req.headers.authorization
    let roleid = req.headers.roleid
    let phone = req.headers.phone
    let t = tokens.checkAdminToken(phone, _t_,roleid)
    t.then(data => {
            let sql = `delete from shop_spec where spec_id = '${specId}'`
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