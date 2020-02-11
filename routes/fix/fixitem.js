const express = require("express");
const mysql = require('../../util/db')
const app = express();
const token = require('../../util/token')
const tokens = new token()
const time = require('../../util/time')
const uuid = require('node-uuid')
const img = require('../../util/img')
const imgutil = new img()

app.use('/GETFIXITEMS', (req, res, next) => {
    let {
        item_name,
        page,
        pageSize
    } = req.body
    let start = (page - 1) * pageSize
    let sql = item_name == ''? `select item_method,item_id,item_name,item_des,fs.sort_id,fs.sort_name from fixitem f,fixitemsort fs where 'delete' = 0 and fs.sort_id = f.sort_id limit ${start},${pageSize * page}` :`select item_method,item_id,item_name,item_des from fixitem where item_name like '%${item_name}%' and 'delete' = 0 limit ${start},${pageSize * page}`
    let sq = item_name == ''? `select count(*) as count from fixitem where 'delete' = 0` :`select count(*) as count from fixitem where item_name like '%${item_name}%' and 'delete' = 0`
    mysql(sql)
        .then(a => {
            mysql(sq).then(data => {
                res.json({
                    code: 200,
                    count: JSON.parse(JSON.stringify(data))[0].count,
                    info: a
                })
            })
        })
        .catch(err => {
            res.json({
                code: 600,
                message: err
            })
        })
})

app.use('/GETFIXITEMBYID', (req, res, next) => {
    let {
        item_id
    } = req.body
    let sql = `select * from fixitem where item_id = '${item_id}'`
    mysql(sql)
        .then(a => {
            res.json({
                code: 200,
                info: a
            })
        })
        .catch(err => {
            res.json({
                code: 600,
                message: err
            })
        })
})
app.use('/ADDFIXITEM', (req, res, next) => {
    let {
        sort_id,
        item_name,
        item_method,
        item_des
    } = req.body
    let _t_ = req.headers.authorization
    let roleid = req.headers.roleid
    let phone = req.headers.phone
    let t = tokens.checkAdminToken(phone, _t_, roleid)
    const ct = time.getTime()
    t.then(data => {
            let item_id = uuid.v1()
            let shopsql = `INSERT INTO fixitem(item_id,item_name,item_des,item_method,sort_id,createTime) VALUES ('${item_id}','${item_name}','${item_des}','${item_method}','${sort_id}','${ct}');`
            mysql(shopsql)
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
        })
        .catch(err => {
            res.json({
                code: 601,
                message: '你没有权限' + err
            })
        })
})

app.use('/UPDATEFIXITEM', (req, res, next) => {
    let {
        item_id,
        sort_id,
        item_name,
        item_method,
        item_des
    } = req.body
    let _t_ = req.headers.authorization
    let roleid = req.headers.roleid
    let phone = req.headers.phone
    let t = tokens.checkAdminToken(phone, _t_, roleid)
    const ct = time.getTime()
    t.then(data => {
            let shopsql = `UPDATE fixitem SET item_name = '${item_name}',sort_id='${sort_id}',item_method = '${item_method}',item_des = '${item_des}' WHERE item_id = '${item_id}';`
            mysql(shopsql)
                .then(data => {
                    res.json({
                        code: 200,
                        message: '更新成功'
                    })
                })
                .catch(err => {
                    res.json({
                        code: 600,
                        message: '更新失败' + err
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

app.use('/DELETEFIXITEM', (req, res, next) => {
    let {
        item_id
    } = req.body
    let _t_ = req.headers.authorization
    let roleid = req.headers.roleid
    let phone = req.headers.phone
    let t = tokens.checkAdminToken(phone, _t_, roleid)
    const ct = time.getTime()
    t.then(data => {
            let sql = `update fixitem set delete = '1' where item_id = '${item_id}'`
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
module.exports = app