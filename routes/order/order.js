const express = require("express");
const mysql = require('../../util/db')
const app = express();
const token = require('../../util/token')
const tokens = new token()
const time = require('../../util/time')
const uuid = require('node-uuid')
const img = require('../../util/img')
const imgutil = new img()
// var async = require('async');

function marrycoupon() {
  let sql = ``
}

function countprice(shopitem) {
  let price = 0
  shopitem.forEach(el => {
    price = parseInt(price) + parseInt(el.price)
  })
  return price
}

function ordershop(phones, orderid, shopitem) {
  return new Promise((resolve, reject) => {
    shopitem.forEach(el => {
      let sql = `INSERT INTO order_shop(order_id, shop_id, sku_id, count, price, createTime) VALUES ('${orderid}', '${el.shopid}','${el.sku_id}','${el.count}','${el.price}',NOW());
       update shopcar set state = 1 where shopid = '${el.shopid}' and sku_id = '${el.sku_id}' and userid = '${phones}'
      `
      mysql(sql)
    })
    resolve()
  })
}

app.use('/CREATEORDERSHOP', (req, res, next) => {
  let {
    shopitem
  } = req.body
  let phones = req.headers.phone // userid
  let orderid = uuid.v1()
  let totalprice = countprice(shopitem)
  let sql = `INSERT INTO orderinfo(order_id, order_type, order_date, order_money, user_id) VALUES ('${orderid}', 0 , '${time.getTime()}','${totalprice}' ,'${phones}');`
  mysql(sql)
    .then(data => {
      ordershop(phones, orderid, shopitem)
      res.json({
        code: 200,
        orderid: orderid,
        message: '订单创建成功'
      })
    })
    .catch(err => {
      res.json({
        code: 600,
        message: '订单创建失败'
      })
    })
})

app.use('/GETORDERCOUNT',(req,res,next)=>{
  let phone = req.headers.phone
  let sql = `select count(*) as waitpay from orderinfo where user_id = '${phone}' and order_state = '1';
  select count(*) as waitfix from orderinfo where user_id = '${phone}' and order_state = '2';
  select count(*) as fixing from orderinfo where user_id = '${phone}' and order_state = '3';
  select count(*) as waitsend from orderinfo where user_id = '${phone}' and order_state = '41' and order_state = '42';
  select count(*) as waitreceive from orderinfo where user_id = '${phone}' and order_state = '5';
  select count(*) as waitcomment from orderinfo where user_id = '${phone}' and order_state = '6';`
  mysql(sql)
  .then(data=>{
    data = JSON.parse(JSON.stringify(data))
    const da = {
      waitpay:data[0][0].waitpay,
      waitfix: data[1][0].waitfix,
      fixing: data[2][0].fixing,
      waitsend: data[3][0].waitsend,
      waitreceive: data[4][0].waitreceive,
      waitcomment: data[5][0].waitcomment
    }
    res.json({
      code: 200,
      info:da
    })
  })
  .catch(err=>{
    res.json({
      code: 600,
      message: '获取失败'
    })
  })
})

// 获取订单商品
app.use('/GETORDERSHOP', (req, res, next) => {
  let {
    orderid,
    userid
  } = req.body
  let sql = `select *,(select shopname from shopinfo where shop_id = o.shop_id) as shopname ,(select sku_concat from sku_stock where id = o.sku_id ) as sku from order_shop o,shopimg s WHERE order_id = '${orderid}' and o.shop_id = s.shopid GROUP BY shop_id`
  mysql(sql)
    .then(data => {
      data = JSON.parse(JSON.stringify(data))
      data.forEach(el=>{
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
        message: '获取失败'
      })
    })
})

// 获取订单可用优惠券
app.use('/GETORDERCOUPON', (req, res, next) => {
  let {
    orderid,
    userid
  } = req.body
  let sql = `select * from coupon c,usercoupon uc where uc.user_id = '${userid}' and 
  uc.use_status = 0 and c.start_time < NOW() and c.over_time > NOW() and c.coupon_id = uc.coupon_id 
  and (c.coupon_id = any(select coupon_id from coupon_shop where shop_id = any(select shop_id from order_shop os where order_id = '${orderid}' 
  and c.min_price < os.price)) or c.coupon_id = any(select coupon_id from coupon_sort co where co.sort_id = any(select shopsort from shopinfo s,order_shop os where os.order_id = '${orderid}' 
  and s.shop_id = os.shop_id and c.min_price < os.price)) or c.use_type =0) GROUP BY c.coupon_id;  `
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
        message: '获取失败'
      })
    })
})

// 获取用户订单
app.use('/GETUSERORDER',(req,res,next)=>{
  let phone = req.headers.phone
  let sql = `select * from orderinfo `
})

module.exports = app