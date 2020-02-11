const express = require("express");
const mysql = require('../../util/db')
const app = express();
const token = require('../../util/token')
const tokens = new token()
const time = require('../../util/time')
const uuid = require('node-uuid')
const img = require('../../util/img')
const imgutil = new img()

app.use('/GETSORTS', (req, res, next) => {
    let {
        sort_name,
        page,
        pageSize
    } = req.body
    let start = (page - 1) * pageSize
    let sql = sort_name == ''? `select sort_id,sort_name from fixitemsort where 'delete' = 0 limit ${start},${pageSize * page}` :`select sort_id,sort_name from fixitemsort where item_name like '%${sort_name}%' and 'delete' = 0 limit ${start},${pageSize * page}`
    let sq = sort_name == ''? `select count(*) as count from fixitemsort where 'delete' = 0` :`select count(*) as count from fixitemsort where sort_name like '%${sort_name}%' and 'delete' = 0`
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

app.use('/GETSORTBYID', (req, res, next) => {
    let {
        sort_id
    } = req.body
    let sql = `select * from fixitemsort where sort_id = '${sort_id}'`
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
app.use('/ADDSORT', (req, res, next) => {
    let {
        sort_name
    } = req.body
    let _t_ = req.headers.authorization
    let roleid = req.headers.roleid
    let phone = req.headers.phone
    let t = tokens.checkAdminToken(phone, _t_, roleid)
    const ct = time.getTime()
    t.then(data => {
            let sort_id = uuid.v1()
            let shopsql = `INSERT INTO fixitemsort(sort_id,sort_name,createTime) VALUES ('${sort_id}','${sort_name}','${ct}');`
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

app.use('/UPDATESORT', (req, res, next) => {
    let {
        item_id,
        item_name,
        item_des
    } = req.body
    let _t_ = req.headers.authorization
    let roleid = req.headers.roleid
    let phone = req.headers.phone
    let t = tokens.checkAdminToken(phone, _t_, roleid)
    const ct = time.getTime()
    t.then(data => {
            let shopsql = `UPDATE fixitemsort SET sort_name = '${sort_name}' WHERE sort_id = '${sort_id}';`
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

app.use('/DELETESORT', (req, res, next) => {
    let {
        sort_id
    } = req.body
    let _t_ = req.headers.authorization
    let roleid = req.headers.roleid
    let phone = req.headers.phone
    let t = tokens.checkAdminToken(phone, _t_, roleid)
    const ct = time.getTime()
    t.then(data => {
            let sql = `update fixitemsort set delete = '1' where sort_id = '${sort_id}'`
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