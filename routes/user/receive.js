const express = require("express");
const mysql = require('../../util/db')
const app = express();
const token = require('../../util/token')
const tokens = new token()
const time = require('../../util/time')
const uuid = require('node-uuid')
const img = require('../../util/img')
const imgutil = new img()

app.use('/ADDRECEIVE', (req, res, next) => {
    let {
        receive_name,
        receive_ename,
        receive_icon,
        receive_account
    } = req.body
    let _t_ = req.headers.authorization
    let roleid = req.headers.roleid
    let phone = req.headers.phone
    let t = tokens.checkAdminToken(phone, _t_, roleid)
    t.then(data => {
        let sql = `INSERT INTO receive(receive_id, receive_logo, receive_name, receive_ename, receive_account,createTime) VALUES ('${uuid.v1()}', '${receive_icon}', '${receive_name}', '${receive_ename}','${receive_account}' ,'${time.getTime()}')`
        mysql(sql)
            .then(data => {
                res.json({
                    code: 200,
                    message: '添加成功'
                })
            })
            .catch(err => {
                res.json({
                    code: 600,
                    message: '添加失败' + err
                })
            })
    }).catch(err => {
        res.json({
            code: 601,
            message: '你没有权限' + err
        })
    })
})

app.use('/GETRECEIVE', (req, res, next) => {
    let {
        page,
        pageSize
    } = req.body
    let start = (page - 1) * pageSize
    let sql = `select * from receive where isshow = 0 limit ${start},${pageSize * page}`
    let s = `select count(*) as count from receive where isshow = 1`
    mysql(sql)
        .then(data => {
            mysql(s)
                .then(a => {
                    a = JSON.parse(JSON.stringify(a))
                    res.json({
                        code: 200,
                        count: a[0].count,
                        info: data
                    })
                })
        })
        .catch(err => {
            res.json({
                code: 600,
                message: '获取失败'
            })
        })
})

app.use('/DELETEUSERPAY', (req, res, next) => {
    let {
        paym_id
    } = req.body
    let _t_ = req.headers.authorization
    let phone = req.headers.phone
    let t = tokens.checkToken(phone, _t_)
    t.then(data => {
            let sql = `update user_pay u set u.delete = 1 where paym_id = '${paym_id}'`
            mysql(sql)
                .then(data => {
                    res.json({
                        code: 200,
                        message: '删除成功'
                    })
                })
                .catch(err => {
                    res.json({
                        code: 600,
                        message: '删除失败' + err
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

app.use('/DELETERECEIVE', (req, res, next) => {
    let {
        receive_id
    } = req.body
    let _t_ = req.headers.authorization
    let roleid = req.headers.roleid
    let phone = req.headers.phone
    let t = tokens.checkAdminToken(phone, _t_, roleid)
    t.then(data => {
        let sql = `update receive set isshow = 1 where receive_id = '${receive_id}'`
        mysql(sql)
            .then(data => {
                res.json({
                    code: 200,
                    message: '删除成功'
                })
            })
            .catch(err => {
                res.json({
                    code: 600,
                    message: '删除失败' + err
                })
            })
    }).catch(err => {
        res.json({
            code: 601,
            message: '你没有权限' + err
        })
    })
})

app.use('/GETUSERRECEIVE', (req, res, next) => {
    let {
        userid
    } = req.body
    let sql = `select * from user_pay up,receive r where up.user_id = '${userid}' and up.paylist_id = r.receive_id and up.delete = 0`
    mysql(sql)
        .then(data => {
            res.json({
                code: 200,
                info: data
            })
        })
        .catch(err => {
            res.json({
                code: 600,
                message: '添加失败'
            })
        })
})

app.use('/ADDUSERPAY', (req, res, next) => {
    let {
        user_id,
        paylist_id,
        paym_cid
    } = req.body
    let sql = `insert into user_pay(user_id,paym_id,paym_cid,paylist_id,createTime) values('${user_id}','${uuid.v1()}','${paym_cid}','${paylist_id}','${time.getTime()}')`
    let _t_ = req.headers.authorization
    let phone = req.headers.phone
    let t = tokens.checkToken(phone, _t_)
    t.then(data => {
        mysql(sql)
            .then(data => {
                res.json({
                    code: 200,
                    message: '添加成功'
                })
            })
            .catch(err => {
                res.json({
                    code: 600,
                    message: '添加失败'
                })
            })
    }).catch(err => {
        res.json({
            code: 601,
            message: '你没有权限' + err
        })
    })
})

module.exports = app;