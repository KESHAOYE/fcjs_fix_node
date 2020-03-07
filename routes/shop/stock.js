const express = require("express");
const mysql = require('../../util/db')
const app = express();
const token = require('../../util/token')
const tokens = new token()
const time = require('../../util/time')
const uuid = require('node-uuid')
const img = require('../../util/img')
const imgutil = new img()

app.use('/GETSTOCKBYID', (req, res, next) => {
    let {
        shopid,
        page,
        pageSize
    } = req.body
    let start = (page - 1) * pageSize
    let sql = `select * from sku_stock where shop_id = '${shopid}' limit ${start}, ${page * pageSize}`
    let sq = `select count(*) as count from sku_stock where shop_id = '${shopid}'`
    mysql(sql)
        .then(da => {
            mysql(sq).then(data => {
                res.json({
                    code: 200,
                    count: JSON.parse(JSON.stringify(data))[0].count,
                    info: da
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

app.use('/GETSTOCK', (req, res, next) => {
    let {
        id
    } = req.body
    let sql = `select * from sku_stock where id = '${id}'`
    mysql(sql)
        .then(da => {
            res.json({
                code: 200,
                info: da
            })
        })
        .catch(err => {
            res.json({
                code: 600,
                message: err
            })
        })
})

function dealsku(sku, shopid) {
    var result = {}
    var price = 0
    return new Promise(async (resolve, reject) => {
        for (let i = 0; i < sku.length; i++) {
            let sql = `select s.price,ss.spec_name,ssv.sku_value,sks.price as plusprice from shopinfo s,shop_spec ss,shop_sku_spec sks,shop_sku_spec_value ssv where sks.sku_id = '${sku[i]}' and s.shop_id = '${shopid}' and ssv.spec_id = ss.spec_id and sks.sku_id = ssv.sku_id`
            await mysql(sql)
                .then(data => {
                    data = JSON.parse(JSON.stringify(data))
                    data.forEach(el => {
                        result[el.spec_name] = el.sku_value
                        if (price == 0) {
                            price = parseInt(price) + parseInt(el.price) + parseInt(el.plusprice)
                        } else {
                            price = parseInt(price) + parseInt(el.plusprice)
                        }
                    })
                })
        }
        await resolve({
            info: result,
            price: price
        })
    })
}
app.use('/ADDSTOCK', (req, res, next) => {
    let {
        shopid,
        sku,
        stock
    } = req.body
    let _t_ = req.headers.authorization
    let roleid = req.headers.roleid
    let phone = req.headers.phone
    let t = tokens.checkAdminToken(phone, _t_, roleid)
    t.then(data => {
        dealsku(sku, shopid).then(data => {
            let sql = `insert into sku_stock(shop_id,price,stock,sku_concat) values('${shopid}','${data.price}','${stock}','${JSON.stringify(data.info)}')`
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
        })
    }).catch(err => {
        res.json({
            code: 601,
            message: '你没有权限' + err
        })
    })
})

app.use('/UPDATESTOCK', (req, res, next) => {
    let {
        id,
        stock
    } = req.body
    let _t_ = req.headers.authorization
    let roleid = req.headers.roleid
    let phone = req.headers.phone
    let t = tokens.checkAdminToken(phone, _t_, roleid)
    t.then(data => {
        let sql = `update sku_stock set stock='${stock}' where id = ${id}`
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

app.use('/DELETESTOCK', (req, res, next) => {
    let {
        id
    } = req.body
    let _t_ = req.headers.authorization
    let roleid = req.headers.roleid
    let phone = req.headers.phone
    let t = tokens.checkAdminToken(phone, _t_, roleid)
    t.then(data => {
        let sql = `delete from sku_stock where id = '${id}'`
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
module.exports = app