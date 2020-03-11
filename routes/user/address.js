const express = require("express");
const mysql = require('../../util/db')
const app = express();
const token = require('../../util/token')
const tokens = new token()
const time = require('../../util/time')
const uuid = require('node-uuid')
const img = require('../../util/img')
const imgutil = new img()

app.use('/ADDADDRESS', (req, res, next) => {
    let {
        userid,
        name,
        phone,
        area,
        address,
        isdefault
    } = req.body
    let addressid = uuid.v1()
    let _t_ = req.headers.authorization
    let phones = req.headers.phone
    let t = tokens.checkToken(phones, _t_)
    t.then(data => {
            let sql = isdefault == '0' ? `INSERT INTO address_info(addressid, user_id, name, phone, area, address, isDefault,createTime) VALUES ('${addressid}','${userid}',
    '${name}','${phone}','${area}','${address}','${isdefault}','${time.getTime()}')` : `update address_info set isDefault = 0 where user_id='${userid}';INSERT INTO address_info(addressid, user_id, name, phone, area, address, isDefault,createTime) VALUES ('${addressid}','${userid}',
    '${name}','${phone}','${area}','${address}','${isdefault}','${time.getTime()}')`
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
        })
        .catch(err => {
            res.json({
                code: 601,
                message: '你没有权限' + err
            })
        })
})

app.use('/GETADDRESS', (req, res, next) => {
    let {
        userid
    } = req.body
    let sql = `select * from address_info a where a.user_id = '${userid}' and a.delete = 0`
    mysql(sql)
        .then(data => {
            res.json({
                code: 200,
                info: data
            })
        })
})

app.use('/GETADDRESSBYID', (req, res, next) => {
    let {
        userid,
        addressid
    } = req.body
    let sql = `select * from address_info where user_id = '${userid}' and addressid = '${addressid}'`
    mysql(sql)
        .then(data => {
            res.json({
                code: 200,
                info: data
            })
        })
})

app.use('/UPDATEADDRESS', (req, res, next) => {
    let {
        userid,
        name,
        phone,
        area,
        address,
        isDefault,
        addressid
    } = req.body
    let _t_ = req.headers.authorization
    let phones = req.headers.phone
    let t = tokens.checkToken(phones, _t_)
    t.then(data => {
            let sql = isDefault == '0' ? `UPDATE address_info SET name = '${name}', phone = '${phone}', area = '${area}', address = '${address}', isDefault = '${isDefault}' WHERE addressid = '${addressid}';` : `update address_info set isDefault = 0 where user_id='${userid}';UPDATE address_info SET name = '${name}', phone = '${phone}', area = '${area}', address = '${address}', isDefault = '${isDefault}' WHERE addressid = '${addressid}';`
            mysql(sql)
                .then(data => {
                    res.json({
                        code: 200,
                        message: '修改成功'
                    })
                })
                .catch(err => {
                    res.json({
                        code: 600,
                        message: '修改失败'
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

app.use('/DELETEADDRESS', (req, res, next) => {
    let {
        addressid
    } = req.body
    let _t_ = req.headers.authorization
    let phones = req.headers.phone
    let t = tokens.checkToken(phones, _t_)
    t.then(data => {
            let sql = `UPDATE address_info a SET a.delete = 1 WHERE addressid = '${addressid}';`
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
                        message: '删除失败'
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
module.exports = app;