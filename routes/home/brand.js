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

// 根据Id获取品牌信息
app.use('/GETBRANDBYID', (req,res,next)=>{
    let {brandid} = req.body
    let sql = `select * from brandinfo where brandid = ${brandid}`
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
// 添加品牌
app.use('/ADDBRAND',(req,res,next)=>{
    let { brandname, brandename, brandimg, isfix, phone } = req.body
        let _t_ = req.headers.authorization
        let imgs = imgutil.saveImg(brandimg)
        let t = tokens.checkToken(phone, _t_)
        t.then(data => {
                let sql = `insert into brandinfo(id,brandname,brandename,brangimg,isfix) values(${uuid.v1()},${brandname},${brandename},${imgs},${isfix})`
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
                    code: 600,
                    message: '你没有权限' + err
                })
            })
})

// 修改品牌
app.use('/UPDATEBRAND',(req,res,next)=>{
    let { brandid, brandname, brandename, brandimg, isfix, phone } = req.body
    let _t_ = req.headers.authorization
    let imgs = imgutil.saveImg(brandimg)
    let t = tokens.checkToken(phone, _t_)
    const ct = time.getTime()
        t.then(data => {
                let sql = `update brandinfo set brandname = ${brandname}, brandename = ${brandename}, brandimg = ${brandimg} , isfix = ${isfix} where brandid = ${brandid}`
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
                    code: 600,
                    message: '你没有权限' + err
                })
            })    
})

app.use('/DELETEAD', (req, res, next) => {
    let { brandid,phone } = req.body
    let _t_ = req.headers.authorization
    let t = tokens.checkToken(phone, _t_)
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
                code: 600,
                message: '你没有权限' + err
            })
        })
})

module.exports = app