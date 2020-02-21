const express = require("express");
const mysql = require('../../util/db')
const app = express();
const token = require('../../util/token')
const tokens = new token()
const queryString = require('querystring')
const xml = require('xml2js')
const http = require('request')
const time = require('../../util/time')
const uuid = require('node-uuid')
const img = require('../../util/img')
const imgutil = new img()

// 售后模块
// 获取售后信息，包括商品是否可选，时间是否超出
app.use('/GETAFTERSAILINFO', (req, res, next) => {
    let {
        orderid
    } = req.body
    let _t_ = req.headers.authorization
    let phone = req.headers.phone
    let t = tokens.checkToken(phone, _t_)
    t.then(data => {
            let sql = `select *,(select shopname from shopinfo where shop_id = o.shop_id) as shopname ,(select sku_concat from sku_stock where id = o.sku_id ) as sku,(select status from aftersail a where a.order_id = o.order_id) as afterstatus from order_shop o,shopimg s WHERE o.order_id = '${orderid}' and o.shop_id = s.shopid GROUP BY o.sku_id;
  select createTime as time from order_state n where n.order_id = '${orderid}' and n.now_state = '6';
  `
            mysql(sql)
                .then(data => {
                    data = JSON.parse(JSON.stringify(data))
                    let result = []
                    data[0].forEach(el => {
                        el.path = imgutil.imgtobase(`./public${el.path}`)
                    })
                    let time = new Date(data[1][0].time)
                    let canreturn = (new Date() - time) / (1000 * 60 * 60 * 24) <= 7
                    let canchange = (new Date() - time) / (1000 * 60 * 60 * 24) <= 7
                    let canfix = (new Date() - time) / (1000 * 60 * 60 * 24) <= 365;
                    result = {
                        shopList: data[0],
                        canreturn: canreturn,
                        canchange: canchange,
                        canfix: canfix
                    }
                    res.json({
                        code: 200,
                        info: result
                    })
                })
        })
        .catch(err => {
            res.json({
                code: 601,
                message: '你没有权限'
            })
        })
})

app.use('/ADDAFTERSAIL', (req, res, next) => {
    let {
        aftershop,
        orderid,
        type
    } = req.body
    let _t_ = req.headers.authorization
    let phone = req.headers.phone
    let t = tokens.checkToken(phone, _t_)
    t.then(data => {
            let sql = ''
            aftershop.forEach(el => {
                sql += `insert into aftersail(order_id,shop_id,sku_id,type,createTime) values('${orderid}','${el.shopid}','${el.sku_id}','${type}','${time.getTime()}');`
            })
            sql += `update orderinfo set order_state = '${type + 8}' where order_id = '${orderid}';
    insert into order_state(order_id,now_state,createTime) values('${orderid}','${type + 8}','${time.getTime()}')`
            mysql(sql)
                .then(data => {
                    res.json({
                        code: 200,
                        message: '申请成功'
                    })
                })
                .catch(err => {
                    res.json({
                        code: 600,
                        message: '申请失败' + err
                    })
                })
        })
        .catch(err => {
            res.json({
                code: 601,
                message: '你没有权限'
            })
        })
})

// 获取还未发货的商品
app.use('/GETUSERAFTERSAIL', (req, res, next) => {
    let {
        page,
        pageSize
    } = req.body
    let start = (page - 1) * pageSize
    let sql = `select * from orderinfo o,aftersail a where o.order_state = 8 or o.order_state = 9 or o.order_state = 10 and a.order_id = o.order_id limit ${start},${page * pageSize}`
    let s = `select count(*) as count from orderinfo o,aftersail a where o.order_state = 8 or o.order_state = 9 or o.order_state = 10 and a.order_id = o.order_id `
    mysql(sql)
        .then(data => {
            mysql(s)
                .then(datas => {
                    datas = JSON.parse(JSON.stringify(datas))
                    res.json({
                        code: 200,
                        count: datas[0].count,
                        info: data
                    })
                })
        })
        .catch(err => {
            res.json({
                code: 600,
                message: '获取失败' + err
            })
        })
})

app.use('/AFTERSAILDETAIL', (req, res, next) => {
    let {
        orderid
    } = req.body
    let sql = `select * from aftersail a,shopinfo s,sku_stock ss,shopimg si where ss.shop_id = si.shopid and a.shop_id = s.shop_id and a.shop_id = ss.shop_id and a.sku_id = ss.id and a.order_id = '${orderid}' group by sku_id;`
    mysql(sql)
        .then(data => {
            data.forEach(el => {
                el.path = imgutil.imgtobase(`./public${el.path}`)
              })
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

app.use('/AGREEAFTERSAIL',(req,res,next)=>{
    let {
        orderid,
      } = req.body
      let _t_ = req.headers.authorization
      let roleid = req.headers.roleid
      let phones = req.headers.phone
      let t = tokens.checkAdminToken(phones, _t_, roleid)
      const ct = time.getTime()
      t.then(data => {
      let sql = `update orderinfo set order_state = 11 where order_id = '${orderid}';
      update aftersail set status = 1 where order_id = '${orderid}';
      insert into order_state(order_id,now_state,createTime) values('${orderid}','11','${time.getTime()}');
      select a.phone from address_info a ,orderinfo o where o.order_id = '${orderid}' and o.addressid = a.addressid;
      `
      mysql(sql)
        .then(data => {
          data = JSON.parse(JSON.stringify(data))
          console.log(data);
          let querydata = queryString.stringify({
            action: 'send',
            userid: '7530',
            account: 'tebicom',
            password: 'tebicom123',
            content: `【福城建设】: 尊敬的用户，您的订单已完成售后审核，详情请前往订单中心查看！`,
            mobile: data[3][0].phone
          })
          let option = {
            url: `http://sms.37037.com/sms.aspx?${querydata}`
          }
          var xmls = new xml.Parser({
            explicitArray: false,
            ignoreAttrs: true
          });
          http(option, (err, re, body) => {
            xmls.parseString(body, (err, data) => {
              data = data.returnsms
              if (data.returnstatus == 'Success') {
                res.json({
                  code: 200,
                  message: '成功'
                })
              } else {
                res.json({
                  code: 600,
                  message: data.message
                })
              }
            })
          })
        })
      })
      .catch(err=>{
        res.json({
          code: 601,
          message: '你没有权限'
        })
      })
})
module.exports = app;