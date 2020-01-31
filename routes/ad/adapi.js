const express = require("express");
const mysql = require('../../util/db')
const img = require('../../util/img')
const app = express();
const imgutil = new img()
const token = require('../../util/token')
let tokens = new token()
const time = require('../../util/time')
const uuid = require('node-uuid')

//客户域

/**通过广告位获取广告 */
app.use('/GETAD', (req, res, next) => {
    let {
        adid
    } = req.body
    let sql = `SELECT * FROM adinfo where adid = ${adid} and DATE(startdue) <= DATE(NOW()) and DATE(overdue)>=DATE(NOW())  `
    mysql(sql)
        .then(data => {
            res.json({
                code: 200,
                status: true,
                adid: adid,
                info: data
            })
        })
        .catch(err => {
            res.json({
                code: 600,
                status: false,
                message: err
            })
        })
})
// 管理员域
// 添加广告
app.use('/ADDAD', (req, res, next) => {
    let {
        adid,
        adimg,
        startdue,
        overdue,
        shopid
    } = req.body
    let _t_ = req.headers.authorization
    let imgs = imgutil.saveImg('/ad/',adimg)
    let roleid = req.headers.roleid
    let phone = req.headers.phone
    let t = tokens.checkAdminToken(phone, _t_,roleid)
    const ct = time.getTime()
    console.log(shopid);
    t.then(data => {
            let sql = shopid == '' ? `insert into adinfo(id,adid,adimg,startdue,overdue,create_man,createTime) values('${uuid.v1()}','${adid}','${imgs}','${time.getTime(startdue)}','${time.getTime(overdue)}','${phone}','${ct}')` : `insert into adinfo(id,adid,adimg,shopid,startdue,overdue,create_man,createTime) values('${uuid.v1()}','${adid}','${imgs}',${shopid},'${time.getTime(startdue)}','${time.getTime(overdue)}','${phone}','${ct}')`
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
//更改广告
app.use('/UPDATEAD', (req, res, next) => {
    let {
        id,
        adid,
        adimg,
        startdue,
        overdue,
        shopid,
        shopres
    } = req.body
    let _t_ = req.headers.authorization
    let imgs = imgutil.saveImg('/ad/',adimg)
    let roleid = req.headers.roleid
    let phone = req.headers.phone
    let t = tokens.checkAdminToken(phone, _t_,roleid)
    t.then(data => {
            let sql = `update adinfo set adid = '${adid}', adimg = '${imgs}', shopid = '${shopid}' , startdue = '${time.getTime(startdue)}' , overdue = '${time.getTime(overdue)}' , res = '${shopres}' where id = '${id}'`
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
// 删除广告
app.use('/DELETEAD', (req, res, next) => {
    let {
        id,
    } = req.body
    let _t_ = req.headers.authorization
    let roleid = req.headers.roleid
    let phone = req.headers.phone
    let t = tokens.checkAdminToken(phone, _t_,roleid)
    t.then(data => {
            let sql = `update adinfo set isshow = ${0} where id = ${id}`
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
app.use('/GETADBYID',(req,res,next)=>{
    let {id} = req.body
    let sql = `select *,s.shopname from adinfo a,shopinfo s where a.id = ${id} and a.shopid =  s.shop_id `
    mysql(sql).then(data => {
        data = JSON.parse(JSON.stringify(data))[0]
        data.adimg=imgutil.imgtobase(`./public${data.adimg}`)
        res.json({
            code: 200,
            info:data
        })
    })
    .catch(err => {
        res.json({
            code: 600,
            message: err
        })
    })
})
// 条件搜索广告
app.use('/GETADS',(req,res,next)=>{
    // isover: 0 全部，1:未过期,2:已过期
    // adid: 0:全部, 1:轮播图, 2:首页推荐  其他暂未定
    let {adid , isover, page, pageSize} = req.body
    let s = {
        0: '1',
        1: 'DATE(startdue) <= DATE(NOW()) and DATE(overdue)>=DATE(NOW())',
        2: 'DATE(startdue) >= DATE(NOW()) or DATE(overdue) <= DATE(NOW())',
        undefined: '1'
    }[isover]
    let a ={
        0: '1',
        1: 'adid = 1',
        2: 'adid = 2',
        undefined: '1'
    }[adid]
    let start = (page-1)*pageSize
    let sql = `select id,adid,res,s.shopname,adimg,startdue,overdue,isshow from adinfo a,shopinfo s where s.shop_id = a.shopid and ${s} and ${a} group by id  order by isshow desc limit ${start},${pageSize}`
    let sq = `select count(*) as count from adinfo a,shopinfo s where s.shop_id = a.shopid and ${s} and ${a}`
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

module.exports = app;