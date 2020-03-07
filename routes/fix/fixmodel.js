const express = require("express");
const mysql = require('../../util/db')
const app = express();
const token = require('../../util/token')
const tokens = new token()
const time = require('../../util/time')
const uuid = require('node-uuid')
const img = require('../../util/img')
const imgutil = new img()

app.use('/GETMODELS', (req, res, next) => {
    let {
        model_name,
        page,
        pageSize
    } = req.body
    let i = model_name
    let start = (page - 1) * pageSize
    let sql = model_name == '' ? `select f.model_id,f.model_name,f.model_img,f.brand_id,b.brandname from fixmodel f,model_item m,fixitem fi,fixitemsort fs,brandinfo b where f.delete = 0 and f.model_id = m.model_id and f.brand_id = b.brandid GROUP BY m.model_id limit ${start},${pageSize * page}` : `select f.model_id,f.model_name,f.model_img,f.brand_id,b.brandname GROUP_CONCAT('{sort_name:"',fs.sort_name,'",item_name:"',fi.item_name,'",price:"',m.price,'"}') as info from fixmodel f,model_item m,fixitem fi,fixitemsort fs,brandinfo b where f.delete = 0 and f.model_id = m.model_id and m.item_id = fi.item_id and fs.sort_id = fi.sort_id and f.brand_id = b.brandid and f.model_name like '%${model_name}%' limit ${start},${pageSize * page}`
    let sq = model_name == '' ? `select count(*) as count from fixmodel f,model_item m,fixitem fi,fixitemsort fs,brandinfo b where f.delete = 0 and f.model_id = m.model_id and m.item_id = fi.item_id and fs.sort_id = fi.sort_id and f.brand_id = b.brandid ` : `select count(*) as count from fixmodel f,model_item m,fixitem fi,fixitemsort fs,brandinfo b where f.delete = 0 and f.model_id = m.model_id and m.item_id = fi.item_id and fs.sort_id = fi.sort_id and f.brand_id = b.brandid and f.model_name like '%${model_name}%'`
    mysql(sql)
        .then(a => {
            a = JSON.parse(JSON.stringify(a))
            let result = []
            if (a[0].model_id != null) {
                a.forEach(el => {
                    const data = {
                        model_id: el.model_id,
                        model_name: el.model_name,
                        model_img: imgutil.imgtobase(`./public${el.model_img}`),
                        brand_id: el.brand_id,
                        brand_name: el.brandname,
                        info: el.info
                    }
                    result.push(data)
                })
            }
            mysql(sq).then(data => {
                res.json({
                    code: 200,
                    count: JSON.parse(JSON.stringify(data))[0].count,
                    info: result
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

app.use('/GETMODELBYID', (req, res, next) => {
    let {
        model_id
    } = req.body
    let sql = `select f.model_id,f.model_name,f.model_img,f.brand_id,b.brandname,item_name,GROUP_CONCAT('{"sort_name":"',fs.sort_name,'"/"item_name":"',fi.item_name,'"/"price":"',m.price,'"/"des":"',fi.item_des,'"/"method":"',fi.item_method,'"/"item_id":"',fi.item_id,'"}') as info from fixmodel f,model_item m,fixitem fi,fixitemsort fs,brandinfo b where f.delete = 0 and f.model_id = m.model_id and m.item_id = fi.item_id and fs.sort_id = fi.sort_id and f.brand_id = b.brandid and f.model_id =  '${model_id}'`
    mysql(sql)
        .then(a => {
            a = JSON.parse(JSON.stringify(a))
            let data = a[0]
            if (data.info.length > 0) {
                let s = []
                let a = data.info.split(',')
                a.forEach(el => {
                    el = el.replace(/\//g, ',')
                    s.push(JSON.parse(el))
                })
                data.info = s
            }
            let result = [{
                model_name: data.model_name,
                brand_id: data.brand_id,
                model_img: imgutil.imgtobase(`./public${data.model_img}`),
                item: data.info
            }]
            res.json({
                code: 200,
                info: result
            })
        })
        .catch(err => {
            res.json({
                code: 600,
                message: err
            })
        })
})

function additem(model_id, fixitem) {
    for (let i = 0; i < fixitem.length; i++) {
        let sql = `insert into model_item(model_id,item_id,price) values('${model_id}','${fixitem[i].item_id}',${fixitem[i].price})`
        mysql(sql)
    }
}
app.use('/ADDMODEL', (req, res, next) => {
    let {
        brand_id,
        model_name,
        model_img,
        fixitem
    } = req.body
    let _t_ = req.headers.authorization
    let roleid = req.headers.roleid
    let phone = req.headers.phone
    let imgs = imgutil.saveImg('/model/', model_img)
    let t = tokens.checkAdminToken(phone, _t_, roleid)
    const ct = time.getTime()
    t.then(data => {
            let model_id = uuid.v1()
            let shopsql = `INSERT INTO fixmodel(brand_id, model_id, model_name, model_img, createTime) VALUES ( '${brand_id}', '${model_id}', '${model_name}', '${imgs}', '${ct}');`
            mysql(shopsql)
                .then(data => {
                    additem(model_id, fixitem)
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

function deleteitem(model_id) {
    return new Promise((resolve, reject) => {
        let sql = `
        delete from model_item where model_id = '${model_id}');`
        mysql(sql)
            .then(data => {
                resolve()
            })
            .catch(err => {
                reject(err)
            })
    })
}
app.use('/UPDATEMODEL', (req, res, next) => {
    let {
        model_id,
        brand_id,
        model_name,
        model_img,
        fixitem
    } = req.body
    let _t_ = req.headers.authorization
    let roleid = req.headers.roleid
    let phone = req.headers.phone
    let imgs = imgutil.saveImg('/model/', model_img)
    let t = tokens.checkAdminToken(phone, _t_, roleid)
    const ct = time.getTime()
    t.then(data => {
            let shopsql = `UPDATE fixmodel SET brand_id = '${brand_id}', model_name = '${model_name}', model_img = '${imgs}', createTime = '${ct}' WHERE model_id= '${model_id}';`
            deleteitem(model_id)
            mysql(shopsql)
                .then(data => {
                    additem(model_id, fixitem)
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

app.use('/DELETEMODEL', (req, res, next) => {
    let {
        model_id
    } = req.body
    let _t_ = req.headers.authorization
    let roleid = req.headers.roleid
    let phone = req.headers.phone
    let t = tokens.checkAdminToken(phone, _t_, roleid)
    const ct = time.getTime()
    t.then(data => {
            let sql = `update fixmodel f set f.delete = 1 where model_id = '${model_id}'`
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

app.use('/UGETFIXBRAND', (req, res, next) => {
    let sql = `select * from brandinfo b,fixmodel f where isfix = 1 and f.brand_id =b.brandid order by brandid asc`
    mysql(sql)
        .then(data => {
            data = JSON.parse(JSON.stringify(data))
            let result = []
            data.forEach(el => {
                var index = result.findIndex(els => {
                    return els.brandid == el.brandid
                })
                if (index == -1) {
                    const data = {
                        brandid: el.brandid,
                        brandname: el.brandname,
                        brandename: el.brandename,
                        list: [{
                            model_id: el.model_id,
                            model_name: el.model_name,
                            model_img: imgutil.imgtobase(`./public${el.model_img}`)
                        }]
                    }
                    result.push(data)
                } else {
                    result[index].list.push({
                        model_id: el.model_id,
                        model_name: el.model_name,
                        model_img: imgutil.imgtobase(`./public${el.model_img}`)
                    })
                }
            })
            res.json({
                code: 200,
                info: result
            })
        })
        .catch(err => {
            res.json({
                code: 600,
                message: '获取失败' + err
            })
        })
})

// 获取等待维修的机型
app.use('/GETWAITFIX',(req,res,next)=>{
    let _t_ = req.headers.authorization
    let roleid = req.headers.roleid
    let phone = req.headers.phone
    let t = tokens.checkAdminToken(phone, _t_, roleid)
    const ct = time.getTime()
    t.then(data => {
        let sql = `select * from orderinfo where order_state = 2 and order_type = 1`
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
                        message: '获取失败' + err
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

app.use('/GETFIXMONEY',(req,res,next)=>{
  let {orderid} = req.body
  let sql = `select man_price from fixorder where order_id = '${orderid}'`
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
                        message: '获取失败' + err
                    })
                })
})
module.exports = app