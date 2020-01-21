const express = require("express");
const mysql = require('../../util/db')
const app = express();
const token = require('../../util/token')

// 获取分类
app.use('/GETSORT', (req, res, next) => {
    let sql = `select * from sortinfo 
    left join shopinfo on sortinfo.sortid = shopinfo.shopsort 
    left join (select * from shopimg group by shopid) as b on b.shopid = shopinfo.shop_id`
    let result = []
    mysql(sql)
        .then(data => {
            let b = []
            data.forEach(function(cur) {
                let index = b.findIndex((item) => item.sortid == cur.sortid)
                if (index != -1) {
                    let object = {
                        shopid: cur.shop_id,
                        shopname: cur.shopname,
                        shopimg: cur.path
                    }
                    b[index].data.push(object)
                } else {
                    let object = {
                        sortid: cur.sortid,
                        sortname: cur.sortname,
                        sortename: cur.sortename,
                        data: [{
                            shopid: cur.shop_id,
                            shopname: cur.shopname,
                            shopimg: cur.path
                        }]
                    }
                    b.push(object)
                }
            })
            res.json({
                code: 200,
                status: true,
                info: b
            })
        })
        .catch(err => {
            res.json({
                code: 600,
                message: err
            })
        })
})

//添加分类

app.use('/ADDSORT', (req, res, next) => {
    let {
        sortname,
        sortename,
        userType,
        phone
    } = req.body
    let _t_ = req.headers.authorization
    let imgs = imgutil.saveImg(adimg)
    let t = tokens.checkToken(phone, _t_)
    const ct = time.getTime()
    t.then(data => {
            let sql = `insert into sortinfo(sortname,sortename,createTime) values(${sortname},${sortename},${ct})`
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

//改变分类

app.use('/UPDATESORT', (req, res, next) => {
    let {
        sortid,
        sortname,
        sortename,
        userType,
        phone
    } = req.body
    let _t_ = req.headers.authorization
    let imgs = imgutil.saveImg(adimg)
    let t = tokens.checkToken(phone, _t_)
    const ct = time.getTime()
    t.then(data => {
            let sql = `update sortinfo set sortname= ${sortname},sortename = ${sortename} where sortid = ${sortid}`
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

//删除分类

app.use('/DELETESORT', (req, res, next) => {
    let { id } = req.body
    let _t_ = req.headers.authorization
    let t = tokens.checkToken(phone, _t_)
    t.then(data => {
            let sql = `update sortinfo set isshow = ${0} where id = ${id}`
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