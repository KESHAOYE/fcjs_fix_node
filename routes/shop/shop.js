const express = require("express");
const mysql = require('../../util/db')
const app = express();
const token = require('../../util/token')
const tokens = new token()
const time = require('../../util/time')
const uuid = require('node-uuid')
const img = require('../../util/img')
const imgutil = new img()

function queryString(object) {
    for (let i in object) {
        if (typeof (object[i]) != 'string') {
            delete(object[i])
        } else {
            let a = object[i]
            if (a.indexOf('undefined') != -1 || a == "'%%'" || a== "''") {
                delete(object[i])
            }
        }
    }
    object = JSON.stringify(object)
    object = object.replace(/:/g, '=')
    object = object.replace(/,/g, ' and ')
    object = object.replace(/"/g, '')
    object = object.replace(/{/g, '')
    object = object.replace(/}/g, '')
    object = object.replace('s.shopname=','s.shopname ')
    return object == '' ? '' : `and ${object}`
}

app.use('/GETSHOPS', (req, res, next) => {
    let {
        shopName,
        sortid,
        brandid,
        isold,
        page,
        pageSize
    } = req.body
    let query = {
        "s.shopname": `like '%${shopName}%'`,
        "s.shopsort": `'${sortid}'`,
        "s.brandid": `'${brandid}'`,
        "s.isold": `'${isold}'`
    }
    query = queryString(query)
    let start = (page - 1) * pageSize
    let sql = `
    select s.shop_id,shopname,s.shopdes,sort.sortid,brand.brandid,sort.sortname,brand.brandname,s.isold,s.old_type,si.path from shopinfo s,sortinfo sort,brandinfo brand,shopimg si where s.brandid = brand.brandid and s.shopsort = sort.sortid  and si.shopid = s.shop_id and s.delete = 0  ${query} limit ${start},${pageSize*page};
    select s.shop_id,ss.spec_name,ssv.spec_value from shopinfo s,shop_spec ss,shop_spu_spec sps,shop_spec_value ssv WHERE s.shop_id = sps.shop_id and 
    ss.spec_id = ssv.spec_id and ss.spec_id = sps.spec_id and s.delete = 0;
    select s.shop_id,ss.spec_name,sskv.sku_value,sks.stock, sks.price ,sks.sku_id,sskv.spec_id from shopinfo s,shop_spec ss,shop_sku_spec sks,shop_sku_spec_value sskv WHERE s.shop_id = sks.shop_id and ss.spec_id = sskv.spec_id and sskv.sku_id = sks.sku_id and s.delete = 0 GROUP BY sks.sku_id;`
    let sq = `select count(*) as count from shopinfo`
    mysql(sql)
        .then(a => {
            let result = []
            a[0].forEach(el => {
                let index = result.findIndex(es => {
                    return el.shop_id == es.shop_id
                })
                if (index != -1) {
                    if (el.path != null) {
                        result[index].img.push(imgutil.imgtobase(`./public${el.path}`))
                    }
                } else {
                    const data = {
                        shop_id: el.shop_id,
                        shopName: el.shopname,
                        sortid: el.sortid,
                        shopdes: el.shopdes,
                        sortname: el.sortname,
                        brandid: el.brandid,
                        brandname: el.brandname,
                        isold: el.isold,
                        price: el.price,
                        oldType: el.oldtype,
                        img: [],
                        spu: [],
                        sku: []
                    }
                    let ni = result.push(data)
                    if (el.path != null) {
                        result[ni - 1].img.push(imgutil.imgtobase(`./public${el.path}`))
                    }
                }
            })
            // 处理spu
            a[1].forEach(el => {
                let index = result.findIndex(es => {
                    return el.shop_id == es.shop_id
                })
                if (index != -1) {
                    const data = {
                        specName: el.spec_name,
                        specValue: el.spec_value
                    }
                    result[index].spu.push(data)
                } else {}
            })
            //处理sku
            a[2].forEach(el => {
                let index = result.findIndex(es => {
                    return el.shop_id == es.shop_id
                })
                if (index != -1) {
                    let indexs = result[index].sku.findIndex(et => {
                        return et.specId == el.spec_id
                    })
                    console.log(indexs)
                    if (indexs != -1) {
                        const data = {
                            specValue: el.sku_value,
                            stock: el.stock,
                            price: el.price,
                            skuId: el.sku_id
                        }
                        result[index].sku[indexs].value.push(data)
                    } else {
                        const data = {
                            specId: el.spec_id,
                            specName: el.spec_name,
                            value: [{
                                specValue: el.sku_value,
                                stock: el.stock,
                                price: el.price,
                                skuId: el.sku_id
                            }]
                        }
                        result[index].sku.push(data)
                    }
                }
            })
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

function addshopimg(shopid, a, ct) {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < a.length; i++) {
            let imgs = imgutil.saveImg('/shop/', a[i])
            let sql = `INSERT INTO shopimg(shopid, path, createTime) VALUES ('${shopid}','${imgs}','${ct}')`
            mysql(sql).then(data => {})
                .catch(err => {
                    reject(err)
                })
        }
        resolve()
    })
}

function addskpu(type, shopid, val, ct) {
    // val.replace('[','')
    // val.replace(']','')
    if(Array.prototype.isPrototypeOf(val) == true)
    return new Promise((resolve, reject) => {
        for (let i = 0; i < val.length; i++) {
            let sku_id = uuid.v1()
            let sql = type == 'SPU' ? `insert into shop_spec_value(spec_id,spec_value,createTime) values('${val[i].spec_id}','${val[i].spec_value}','${ct}');
    insert into shop_spu_spec(shop_id,spec_id,createTime) values('${shopid}','${val[i].spec_id}','${ct}');` : `insert into shop_sku_spec_value(spec_id,sku_id,sku_value,createTime) values('${val[i].spec_id}','${sku_id}','${val[i].spec_value}','${ct}');
    insert into shop_sku_spec(shop_id,sku_id,price,stock) values('${shopid}','${sku_id}','${val[i].price}','${0}')`
            mysql(sql)
                .then(data => {})
                .catch(err => {
                    reject()
                })
        }
        resolve()
    })
}
app.use('/ADDSHOP', (req, res, next) => {
    let {
        shopname,
        shopimg,
        isold,
        oldtype,
        sku,
        spu,
        shopdes,
        brandid,
        sortid,
        price,
        shopdetail
    } = req.body
    let _t_ = req.headers.authorization
    let roleid = req.headers.roleid
    let phone = req.headers.phone
    let t = tokens.checkAdminToken(phone, _t_, roleid)
    const ct = time.getTime()
    t.then(data => {
            let shopid = uuid.v1()
            let shopsql = `INSERT INTO shopinfo(shop_id, shopname, shopdes, shopsort, price, brandid,createTime, isold, old_type) VALUES (
        '${shopid}','${shopname}','${shopdes}','${sortid}','${price}','${brandid}','${ct}','${isold}','${oldtype}');`
            mysql(shopsql)
                .then(data => {
                    addshopimg(shopid, shopimg, ct)
                    addskpu('SPU',shopid,spu,ct)
                    addskpu('SKU',shopid,sku,ct)
                    res.json({
                       code: 200,
                       message: '添加成功'
                    })
                })
                .catch(err=>{
                    res.json({
                        code: 600,
                        message: '添加失败'+err
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