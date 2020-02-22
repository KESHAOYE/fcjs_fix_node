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
            if (a.indexOf('undefined') != -1 || a == "'%%'" || a == "''" || a == '%%') {
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
    object = object.replace('s.shopname=', 's.shopname ')
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
    select s.shop_id,shopname,s.shopdes,sort.sortid,brand.brandid,sort.sortname,a.article_content,brand.brandname,s.isold,s.old_type,GROUP_CONCAT(si.imgid,':',si.path) as imgs from article_info a,shopinfo s,sortinfo sort,brandinfo 
    brand,shopimg si where s.brandid = brand.brandid and s.shopsort = sort.sortid  and si.shopid = s.shop_id and a.shopid = s.shop_id and s.delete = 0  ${query} group by s.shop_id limit ${start},${pageSize*page};
    select s.shop_id,GROUP_CONCAT(ss.spec_name,':',ssv.spec_value) as spuinfo from shopinfo s,shop_spec ss,shop_spu_spec sps,shop_spec_value ssv WHERE  sps.shop_id = s.shop_id and ssv.spu_id = sps.spu_id and sps.spec_id = ssv.spec_id and sps.spec_id = ss.spec_id  group by shop_id;
    select s.shop_id,ss.spec_name,sskv.sku_value,sks.stock, sks.price ,sks.sku_id,sskv.spec_id from shopinfo s,shop_spec ss,shop_sku_spec sks,shop_sku_spec_value sskv WHERE s.shop_id = sks.shop_id and ss.spec_id = sskv.spec_id and sskv.sku_id = sks.sku_id and s.delete = 0 GROUP BY sks.sku_id;`
    let sq = `select count(*) as count from shopinfo`
    mysql(sql)
        .then(a => {
            let result = []
            a[0].forEach(el => {
                let img = []
                let b = el.imgs.split(',')
                b.forEach(es => {
                    let c = es.split(':');
                    img.push({
                        imgid: c[0],
                        path: imgutil.imgtobase(`./public${c[1]}`)
                    })
                })
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
                    shopdetail: el.article_content,
                    oldType: el.oldtype,
                    img: img,
                    spu: [],
                    sku: []
                }
                result.push(data)
            })
            // 处理spu
            a[1].forEach(el => {
                let index = result.findIndex(es => {
                    return el.shop_id == es.shop_id
                })
                if (index != -1) {
                    el.spuinfo.split(',').forEach(et=>{
                        let c = et.split(':')
                        const data = {
                            specName: c[0],
                            specValue: c[1]
                        }
                        result[index].spu.push(data)
                    })
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

app.use('/GETSHOPBYID', (req, res, next) => {
    let {
        shopid
    } = req.body
    let sql = `
    select s.shop_id,s.price,shopname,s.shopdes,sort.sortid,brand.brandid,sort.sortname,brand.brandname,brand.brandename,a.article_content,s.isold,s.old_type,si.path from article_info a,shopinfo s,sortinfo sort,brandinfo brand,shopimg si where s.brandid = brand.brandid and s.shopsort = sort.sortid  and si.shopid = s.shop_id and a.shopid = s.shop_id and s.delete = 0 and s.shop_id = '${shopid}' ;
    select s.shop_id,ss.spec_name,ss.spec_id,ssv.spec_value from shopinfo s,shop_spec ss,shop_spu_spec sps,shop_spec_value ssv WHERE s.shop_id = sps.shop_id and 
    ss.spec_id = ssv.spec_id and ss.spec_id = sps.spec_id and s.delete = 0 and sps.spu_id = ssv.spu_id and s.shop_id = '${shopid}';
    select s.shop_id,ss.spec_name,sskv.sku_value,sks.stock, sks.price ,sks.sku_id,sskv.spec_id from shopinfo s,shop_spec ss,shop_sku_spec sks,shop_sku_spec_value sskv WHERE s.shop_id = sks.shop_id and ss.spec_id = sskv.spec_id and sskv.sku_id = sks.sku_id and s.delete = 0 and s.shop_id = '${shopid}' GROUP BY sks.sku_id;
    select count(*) as count from order_shop where shop_id = '${shopid}';`
    mysql(sql)
        .then(a => {
            let result = []
            a[0].forEach(el => {
                let index = result.findIndex(es => {
                    return el.shop_id == es.shop_id
                })
                if (index != -1) {
                    if (el.path != null) {
                        result[index].img.push({
                            imgid: el.imgid,
                            path: imgutil.imgtobase(`./public${el.path}`)
                        })
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
                        brandename: el.brandename,
                        isold: el.isold,
                        price: el.price,
                        oldType: el.oldtype,
                        shopdetail: el.article_content,
                        sailCount: JSON.parse(JSON.stringify(a[3]))[0].count,
                        img: [],
                        spu: [],
                        sku: []
                    }
                    let ni = result.push(data)
                    if (el.path != null) {
                        result[ni - 1].img.push({
                            imgid: el.imgid,
                            path: imgutil.imgtobase(`./public${el.path}`)
                        })
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
                        spec_id:el.spec_id,
                        spec_name: el.spec_name,
                        spec_value: el.spec_value
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
                    if (indexs != -1) {
                        const data = {
                            spec_value: el.sku_value,
                            stock: el.stock,
                            price: el.price,
                            sku_id: el.sku_id
                        }
                        result[index].sku[indexs].value.push(data)
                    } else {
                        const data = {
                            spec_id: el.spec_id,
                            spec_name: el.spec_name,
                            value: [{
                                spec_value: el.sku_value,
                                stock: el.stock,
                                price: el.price,
                                skuId: el.sku_id
                            }]
                        }
                        result[index].sku.push(data)
                    }
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
                message: err
            })
        })
})

function addshopimg(shopid, a, ct) {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < a.length; i++) {
            let imgs = imgutil.saveImg('/shop/', a[i].path)
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
    if (Array.prototype.isPrototypeOf(val) == true)
        return new Promise((resolve, reject) => {
            for (let i = 0; i < val.length; i++) {
                let sku_id = uuid.v1()
                let sql = type == 'SPU' ? `insert into shop_spec_value(spu_id,spec_id,spec_value,createTime) values('${sku_id}','${val[i].spec_id}','${val[i].spec_value}','${ct}');
    insert into shop_spu_spec(shop_id,spec_id,spu_id,createTime) values('${shopid}','${val[i].spec_id}','${sku_id}','${ct}');` : `insert into shop_sku_spec_value(spec_id,sku_id,sku_value,createTime) values('${val[i].spec_id}','${sku_id}','${val[i].spec_value}','${ct}');
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
        '${shopid}','${shopname}','${shopdes}','${sortid}','${price}','${brandid}','${ct}','${isold}','${oldtype}');
        insert into article_info(shopid,article_content) values('${shopid}','${shopdetail}');
        `
            mysql(shopsql)
                .then(data => {
                    addshopimg(shopid, shopimg, ct)
                    addskpu('SPU', shopid, spu, ct)
                    addskpu('SKU', shopid, sku, ct)
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

function deletespec(shop_id) {
    return new Promise((resolve, reject) => {
        let sql = `
        delete from shop_spec_value where spec_id = any(select spec_id from shop_spu_spec where shop_id = '${shop_id}');
        DELETE from shop_spu_spec where shop_id = '${shop_id}';
        -- 删除sku
        delete from shop_sku_spec_value where sku_id = any(SELECT sku_id from shop_sku_spec where shop_id = '${shop_id}');
        DELETE from shop_sku_spec where shop_id = '${shop_id}';
        delete from sku_stock where shop_id = any(select shop_id from shopinfo where shop_id = '${shop_id}')`;
        mysql(sql)
            .then(data => {
                resolve()
            })
            .catch(err => {
                reject(err)
            })
    })
}

function deleteimg(shop_id) {
    return new Promise((resolve, reject) => {
        let sql = `delete from shopimg where shopid = '${shop_id}'`
        mysql(sql)
            .then(data => {
                resolve()
            })
            .catch(err => {
                reject(err)
            })
    })
}
app.use('/UPDATESHOP', (req, res, next) => {
    let {
        shop_id,
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
    deletespec(shop_id)
    deleteimg(shop_id)
    let _t_ = req.headers.authorization
    let roleid = req.headers.roleid
    let phone = req.headers.phone
    let t = tokens.checkAdminToken(phone, _t_, roleid)
    const ct = time.getTime()
    t.then(data => {
            let shopsql = `UPDATE shopinfo SET shopname = '${shopname}', shopdes = '${shopdes}', shopsort = '${sortid}', price = '${price}', brandid = '${brandid}', isold = '${isold}', old_type = '${oldtype}' WHERE shop_id = '${shop_id}';
            UPDATE article_info SET article_content = '${shopdetail}' WHERE shopid = '${shop_id}';`
            mysql(shopsql)
                .then(data => {
                    addshopimg(shop_id, shopimg, ct)
                    addskpu('SPU', shop_id, spu, ct)
                    addskpu('SKU', shop_id, sku, ct)
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

app.use('/DELETESHOP', (req, res, next) => {
    let {
        shopid
    } = req.body
    let _t_ = req.headers.authorization
    let roleid = req.headers.roleid
    let phone = req.headers.phone
    let t = tokens.checkAdminToken(phone, _t_, roleid)
    const ct = time.getTime()
    t.then(data => {
            let sql = `update shopinfo set delete = '1' where shop_id = '${shopid}'`
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
app.use('/GETSTOCK',(req,res,next)=>{
    let {shopid} = req.body
    let sql = `select * from sku_stock where shop_id = '${shopid}'`
    mysql(sql)
    .then(data=>{
        res.json({
          code: 200,
          info:data
        })
    })
    .catch(err=>{
        res.json({
            code: 600,
            message:err
        })
    })
})

app.use('/GETSALE',(req,res,next)=>{
  let sql = `select *,count(o.shop_id) as count,(SELECT path from shopimg si where s.shop_id = si.shopid limit 0,1) as shopimg from order_shop o,shopinfo s WHERE o.shop_id = s.shop_id ORDER BY count DESC limit 0,3`
  let result = []
  mysql(sql)
  .then(data=>{
    data = JSON.parse(JSON.stringify(data))
    result.push(...data)
    let nsql = `select * ,(SELECT path from shopimg si where s.shop_id = si.shopid limit 0,1) as shopimg from shopinfo s left JOIN order_shop o on s.shop_id = o.shop_id where o.shop_id is null LIMIT 0,${3-data.length}`
    mysql(nsql)
    .then(ds => {
       ds = JSON.parse(JSON.stringify(ds))
       result.push(...ds) 
       res.json({
        code: 200,
        info: result
      })
    })
})
})

module.exports = app