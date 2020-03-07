const express = require("express");
const mysql = require('../../util/db')
const app = express();
const token = require('../../util/token')
const tokens = new token()
const time = require('../../util/time')
const uuid = require('node-uuid')
const img = require('../../util/img')
const imgutil = new img()

/**搜索专用接口 */

app.use('/SEARCHLIST', (req, res, next) => {
    let {
        key,
        count
    } = req.body
    let sql = `select s.shopname from shopinfo s where s.shopname like '%${key}%' limit 0,${count}`
    mysql(sql)
        .then(data => {
            let result = []
            data.forEach(el => {
                var key = null;
                let type = null
                if (el.shopname != null) {
                  type = 'SHOP'
                  key = el.shopname
                } else if(el.item_name) {
                  type = 'FIX'
                  key = el.item_name
                }
                const da = {
                    key: key,
                    type: type
                }
                result.push(da)
            });
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

function queryString(object) {
    for (let i in object) {
        if (typeof (object[i]) != 'string') {
            delete(object[i])
        } else {
            let a = object[i]
            if (a.indexOf('undefined') != -1 || a == "''") {
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
    object = object.replace('price=', 'price > ')
    return object == '' ? '' : `${object}`
}

app.use('/SEARCHRESULT',(req,res,next)=>{
    let {
        userId, // 用户电话号 或 ip地址
        key, //搜索词
        count,
        sort, //所属分类
        isold, //二手标识
        oldtype, //二手状态
        min_price, //价格区间
        max_price
    } = req.body
    let qdata = {
      's.shopname': `like '%${key}%'`,
      'so.sortename': `'${sort&&sort.toUpperCase()}' and so.sortid = s.shopsort`,
      'isold': `'${isold}'`,
      'old_type': `'${oldtype}'`,
      'price': `'${max_price}' and price < '${min_price}'`
    }
    qdata = queryString(qdata)
    let sql = `select s.shop_id,s.shopname,s.isold,s.price,(select path from shopimg si where si.shopid = s.shop_id limit 1) as shopimg,s.price from shopinfo s,shopimg si,sortinfo so where ${qdata} group by s.shop_id`
    mysql(sql)
    .then(data=>{
      let result = [] 
      data.forEach(el=>{
        const d = {
          shop_id:el.shop_id,
          shopname: el.shopname,
          shopimg: imgutil.imgtobase(`./public${el.shopimg}`),
          price: el.price,
          isold: el.isold,
        }
        result.push(d)
      })
      res.json({
          code: 200,
          info: result
      })
    })
    .catch(err=>{
        res.json({
            code: 600,
            message: err
        })
    })
})

module.exports = app