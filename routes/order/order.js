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
      let sql = `INSERT INTO order_shop(order_id, shop_id, sku_id, count, price, createTime) VALUES ('${orderid}', '${el.shopid}','${el.sku_id}','${el.count}','${el.price}','${time.getTime()}');
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
  let _t_ = req.headers.authorization
  let phone = req.headers.phone
  let t = tokens.checkToken(phone, _t_)
  t.then(data => {
      let sql = `INSERT INTO orderinfo(order_id, order_type, order_date, order_money, user_id) VALUES ('${orderid}', 0 , '${time.getTime()}','${totalprice}' ,'${phones}');
  INSERT INTO order_state(order_id,now_state,createTime) values('${orderid}','1','${time.getTime()}')
  `
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
            message: '订单创建失败' + err
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

app.use('/GETORDERCOUNT', (req, res, next) => {
  let _t_ = req.headers.authorization
  let phone = req.headers.phone
  let t = tokens.checkToken(phone, _t_)
  t.then(data => {
      let sql = `select count(*) as waitpay from orderinfo where user_id = '${phone}' and order_state = '1' and isshow = 0;
  select count(*) as waitfix from orderinfo where user_id = '${phone}' and order_state = '2' and isshow = 0;
  select count(*) as fixing from orderinfo where user_id = '${phone}' and order_state = '3' and isshow = 0;
  select count(*) as waitsend from orderinfo where user_id = '${phone}' and order_state = '41' or order_state = '42' and isshow = 0;
  select count(*) as waitreceive from orderinfo where user_id = '${phone}' and order_state = '5' and isshow = 0;
  select count(*) as waitcomment from orderinfo where user_id = '${phone}' and order_state = '6' and isshow = 0;`
      mysql(sql)
        .then(data => {
          data = JSON.parse(JSON.stringify(data))
          const da = {
            waitpay: data[0][0].waitpay,
            waitfix: data[1][0].waitfix,
            fixing: data[2][0].fixing,
            waitsend: data[3][0].waitsend,
            waitreceive: data[4][0].waitreceive,
            waitcomment: data[5][0].waitcomment
          }
          res.json({
            code: 200,
            info: da
          })
        })
        .catch(err => {
          res.json({
            code: 600,
            message: '获取失败'
          })
        })
    })
    .catch(err => {
      res.json({
        code: 601,
        message: '你没有权限访问'
      })
    })
})

// 获取订单商品
app.use('/GETORDERSHOP', (req, res, next) => {
  let {
    orderid,
    userid
  } = req.body
  let _t_ = req.headers.authorization
  let phone = req.headers.phone
  let t = tokens.checkToken(phone, _t_)
  t.then(data => {
      let sql = `select *,(select shopname from shopinfo where shop_id = o.shop_id) as shopname ,(select sku_concat from sku_stock where id = o.sku_id ) as sku from order_shop o,shopimg s WHERE order_id = '${orderid}' and o.shop_id = s.shopid GROUP BY sku_id`
      mysql(sql)
        .then(data => {
          data = JSON.parse(JSON.stringify(data))
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
            message: '获取失败'
          })
        })
    })
    .catch(err => {
      res.json({
        code: 601,
        message: '你没有权限访问'
      })
    })
})

// 获取订单可用优惠券
app.use('/GETORDERCOUPON', (req, res, next) => {
  let {
    orderid,
    userid
  } = req.body
  let _t_ = req.headers.authorization
  let phone = req.headers.phone
  let t = tokens.checkToken(phone, _t_)
  t.then(data => {
      let sql = `select * from coupon c,usercoupon uc where uc.user_id = '${userid}' and 
  uc.use_status = 0 and c.start_time < '${time.getTime()}' and c.over_time > '${time.getTime()}' and c.coupon_id = uc.coupon_id 
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
    .catch(err => {
      res.json({
        code: 601,
        message: '你没有权限访问'
      })
    })
})

app.use('/GETORDERDETAIL', (req, res, next) => {
  let {
    order_id
  } = req.body
  let sql = `select o.order_id,o.order_state,o.order_money,o.true_price,o.order_date,a.name,a.phone,a.area,a.address from orderinfo o,address_info a where o.order_id = '${order_id}' and a.addressid = o.addressId;
  select * from order_state where order_id = '${order_id}' order by createTime asc;
  select p.count,r.receive_name,u.paym_cid,p.pay_bdate from payinfo p,user_pay u,receive r where order_id = '${order_id}' and p.paym_id = u.paym_id and u.paylist_id = r.receive_id;`
  mysql(sql)
    .then(data => {
      data = JSON.parse(JSON.stringify(data))
      const result = {
        state: data[1],
        baseinfo: data[0],
        payinfo: data[2]
      }
      res.json({
        code: 200,
        info: result
      })
    })
    .catch(err => {
      res.json({
        code: 600,
        err: err
      })
    })
})



// 获取用户订单
app.use('/GETUSERORDER', (req, res, next) => {
  let {
    userid
  } = req.body
  let sql = `select o.order_id,order_state,o.order_date,order_money,si.path as shopimg,s.shopname from shopinfo s,shopimg si,orderinfo o,order_shop os where user_id = (select phone from userinfo where user_id = '${userid}') and o.order_id = os.order_id and s.shop_id = os.shop_id and si.shopid = os.shop_id and o.order_state > 0 GROUP BY o.order_id,s.shop_id`
  mysql(sql)
    .then(data => {
      data = JSON.parse(JSON.stringify(data))
      let result = []
      console.log(data);
      data.forEach(el => {
        let index = result.findIndex(e => {
          return e.order_id == el.order_id
        })
        if (index != -1) {
          const shop = {
            shopimg: imgutil.imgtobase(`./public${el.shopimg}`),
            shopname: el.shopname
          }
          result[index].shop.push(shop)
        } else {
          const order = {
            order_id: el.order_id,
            order_state: el.order_state,
            order_money: el.order_money,
            order_date: el.order_date,
            shop: [{
              shopimg: imgutil.imgtobase(`./public${el.shopimg}`),
              shopname: el.shopname
            }]
          }
          result.push(order)
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

// 删除订单
app.use('/DELETEORDER', (req, res, next) => {
  let {
    orderid
  } = req.body
  let _t_ = req.headers.authorization
  let phone = req.headers.phone
  let t = tokens.checkToken(phone, _t_)
  t.then(data => {
      let sql = `update orderinfo set isshow = 1 where order_id = '${orderid}'`
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
        message: '你没有权限'
      })
    })
})

// 获取订单 简略信息
app.use('/GETCENTERORDERINFO', (req, res, next) => {
  let {
    userid,
    page,
    pageSize,
    type
  } = req.body
  let start = (page - 1) * pageSize
  let fixsql = userid == 'all' ? `select o.order_id,order_date,order_state,o.order_type,order_money,fm.model_img as shopimg,model_name as shopname,(select count(*) as count from fixorderitem os where os.order_id = o.order_id)as itemcount,(select name from address_info a where a.addressid = o.addressid) as name from model_item m,orderinfo o,fixorderitem fi,fixmodel fm where fi.model_id=m.model_id and fi.item_id = m.item_id and fi.order_id= o.order_id and o.order_state >0 and o.isshow = 0 and fm.model_id=fi.model_id group by o.order_id limit ${start},${pageSize * page};` : ` select o.order_id,order_date,order_state,o.order_type,order_money,fm.model_img as shopimg,model_name as shopname,(select count(*) as count from fixorderitem os where os.order_id = o.order_id)as itemcount,(select name from address_info a where a.addressid = o.addressid) as name from model_item m,orderinfo o,fixorderitem fi,fixmodel fm where o.user_id = (select phone from userinfo u where u.user_id = '${userid}') and fi.model_id=m.model_id and fi.item_id = m.item_id and fi.order_id= o.order_id and o.order_state >0 and o.isshow = 0 and fm.model_id=fi.model_id group by o.order_id and o.order_state ${type} limit ${start},${pageSize * page}`
  let s = `select count(*) as count from orderinfo o where o.order_state ${type} and isshow = 0`
  let result = []
  mysql(fixsql)
    .then(data => {
      data = JSON.parse(JSON.stringify(data))
      data.forEach(el => {
        el.shopimg = imgutil.imgtobase(`./public${el.shopimg}`)
        result.push(el)
      })
      let count = data.length
      let sql = userid == 'all' ? `select o.order_id,order_state,o.order_type,o.order_date,order_money,si.path as shopimg,s.shopname,(select count(*) as count from order_shop os where os.order_id = o.order_id) as itemcount,(select name from address_info a where a.addressid = o.addressid) as name from shopinfo s,shopimg si,orderinfo o,order_shop os where o.order_id = os.order_id and s.shop_id = os.shop_id and si.shopid = os.shop_id and o.order_state ${type} and o.isshow = 0 group by order_id limit ${start},${pageSize * page - count }` : `select o.order_id,order_state,o.order_type,o.order_date,order_money,si.path as shopimg,s.shopname,(select count(*) as count from order_shop os where os.order_id = o.order_id) as itemcount,(select name from address_info a where a.addressid = o.addressid) as name from shopinfo s,shopimg si,orderinfo o,order_shop os where o.user_id = (select phone from userinfo u where u.user_id = '${userid}') and o.order_id = os.order_id and s.shop_id = os.shop_id and si.shopid = os.shop_id and o.order_state ${type} and o.isshow = 0 group by order_id limit ${start},${pageSize * page - count}`
      mysql(sql)
        .then(b => {
          b = JSON.parse(JSON.stringify(b))
          b.forEach(el => {
            el.shopimg = imgutil.imgtobase(`./public${el.shopimg}`)
            result.push(el)
          })
          mysql(s)
            .then(a => {
              a = JSON.parse(JSON.stringify(a))
              res.json({
                code: 200,
                count: a[0].count,
                info: result
              })
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

app.use('/PAY', (req, res, next) => {
  let {
    order_id,
    address_id,
    coupon_id,
    payid,
    user_id,
    type
  } = req.body
  let _t_ = req.headers.authorization
  let phone = req.headers.phone
  let t = tokens.checkToken(phone, _t_)
  t.then(data => {
      let sql = `drop PROCEDURE IF EXISTS payorder;
  create PROCEDURE payorder(
   IN order_id VARCHAR(255),
   IN address_id VARCHAR(255),
   IN coupon_id VARCHAR(255),
   IN pay_id VARCHAR(255),
   IN user_id VARCHAR(255)
  )
  BEGIN
  DECLARE coupon_amount DECIMAL(10,2) default 0;
  DECLARE order_price DECIMAL(10,2) default 0;
  select amount INTO coupon_amount from coupon c where c.coupon_id = coupon_id;
  select order_money into order_price from orderinfo o where o.order_id = order_id;
  update orderinfo o set order_state = ${type},pay_id = pay_id, addressId = address_id,true_price = order_price - coupon_amount where o.order_id = order_id;
  update usercoupon set use_status = 1,use_time = '${time.getTime()}',order_id =order_id where user_id = user_id and coupon_id = coupon_id;
  insert into payinfo(user_id,order_id,count,paym_id,pay_bdate) VALUES(user_id,order_id,order_price - coupon_amount,pay_id,'${time.getTime()}');
  INSERT into order_state(order_id,now_state,createTime) VALUES(order_id,${type},'${time.getTime()}');
  END;
  CALL payorder('${order_id}','${address_id}','${coupon_id}','${payid}','${user_id}')`
      mysql(sql)
        .then(data => {
          res.json({
            code: 200,
            message: '支付成功'
          })
        })
        .catch(err => {
          res.json({
            code: 600,
            message: '支付失败' + err
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

app.use('/GETFIXORDERDETAIL', (req, res, next) => {
  let {
    orderid
  } = req.body
  let sql = `select * from fixorderitem f,fixitem fi,fixorder fo,fixmodel fm where f.order_id = '${orderid}' and f.item_id = fi.item_id and f.model_id = fm.model_id and fo.order_id = f.order_id`
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

//获取待核验的订单
app.use('/GETUNFIX', (req, res, next) => {
  let {
    page,
    pageSize
  } = req.body
  let start = (page - 1) * pageSize
  let sql = `select * from orderinfo o where o.order_state = 42 limit ${start},${page * pageSize}`
  let s = `select count(*) as count from orderinfo o where o.order_state = 42 `
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

app.use('/WAITFIX', (req, res, next) => {
  let {
    orderid,
    man_price,
    des,
    phonename
  } = req.body
  let _t_ = req.headers.authorization
  let roleid = req.headers.roleid
  let phones = req.headers.phone
  let t = tokens.checkAdminToken(phones, _t_, roleid)
  t.then(data => {
      let sql = `update orderinfo set order_state = 1 where order_id = '${orderid}';
  update fixorder set man_price = '${man_price}',des = '${des}' where order_id = '${orderid}';
  INSERT into order_state(order_id,now_state,createTime) VALUES('${orderid}',1,'${time.getTime()}');
  select a.phone from address_info a ,orderinfo o where o.order_id = '${orderid}' and o.addressid = a.addressid;
  `
      mysql(sql)
        .then(data => {
          data = JSON.parse(JSON.stringify(data))
          let querydata = queryString.stringify({
            action: 'send',
            userid: '7530',
            account: 'tebicom',
            password: 'tebicom123',
            content: `【福城建设】: 尊敬的用户，您的需要维修的: ${phonename} ,订单已完成核验，最终价格为:￥${man_price}， 原因为:${des}，请及时前往订单中心付款或取消订单！`,
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
    .catch(err => {
      res.json({
        code: 601,
        message: '你没有权限' + err
      })
    })
})

// 获取还未发货的商品
app.use('/GETUNDELIVER', (req, res, next) => {
  let {
    page,
    pageSize
  } = req.body
  let start = (page - 1) * pageSize
  let sql = `select * from orderinfo o where o.order_state = 41 limit ${start},${page * pageSize}`
  let s = `select count(*) as count from orderinfo o where o.order_state = 41 `
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

app.use('/SEND', (req, res, next) => {
  let {
    orderid,
    phone
  } = req.body
  let _t_ = req.headers.authorization
  let roleid = req.headers.roleid
  let phones = req.headers.phone
  let t = tokens.checkAdminToken(phones, _t_, roleid)
  const ct = time.getTime()
  t.then(data => {
      let sql = `update orderinfo set order_state = 5 where order_id = '${orderid}';
  insert into order_state(order_id,now_state,createTime) values('${orderid}','5','${time.getTime()}');
  select a.phone from address_info a ,orderinfo o where o.order_id = '${orderid}' and o.addressid = a.addressid;
  `
      mysql(sql)
        .then(data => {
          data = JSON.parse(JSON.stringify(data))
          console.log(data[2][0].phone);
          let querydata = queryString.stringify({
            action: 'send',
            userid: '7530',
            account: 'tebicom',
            password: 'tebicom123',
            content: `【福城建设】: 尊敬的用户，您的订单已完成发货，希望您能给个好评喔，详情请前往订单中心查看！`,
            mobile: data[2][0].phone
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
              console.log(data);
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
    .catch(err => {
      res.json({
        code: 601,
        message: '你没有权限'
      })
    })
})

// 确认收货
app.use('/CONFIRM', (req, res, next) => {
  let {
    orderid,
    type
  } = req.body
  let _t_ = req.headers.authorization
  let phone = req.headers.phone
  let t = tokens.checkToken(phone, _t_)
  t.then(data => {
    let sql = type == 0 ? `update orderinfo set order_state = 6 where order_id = '${orderid}';
    insert into order_state(order_id,now_state,createTime) values('${orderid}','6','${time.getTime()}')`
    : `update orderinfo set order_state = 7 where order_id = '${orderid}';
    insert into order_state(order_id,now_state,createTime) values('${orderid}','7','${time.getTime()}')`
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
        message: '你没有权限'+err
      })
    })
})

function addfixitem(item, orderid) {
  let sql = ''
  item.selectitems.forEach(el => {
    sql += `insert into fixorderitem(model_id,order_id,item_id) value('${item.selectphone}','${orderid}','${el.id}');`
  })
  mysql(sql)
}

app.use('/CREATEFIXORDER', (req, res, next) => {
  let {
    info,
    addressId,
    imei
  } = req.body
  let {
    totalprice
  } = info
  let _t_ = req.headers.authorization
  let phone = req.headers.phone
  let t = tokens.checkToken(phone, _t_)
  t.then(data => {
      let orderid = uuid.v1()
      let sql = `INSERT INTO orderinfo(order_id, order_type, order_date, order_money, order_state,addressId, user_id) VALUES ('${orderid}', 1 , '${time.getTime()}','${totalprice}' ,42,'${addressId}','${phone}');
  INSERT INTO order_state(order_id,now_state,createTime) values('${orderid}','42','${time.getTime()}');
  INSERT INTO fixorder(order_id, imei, auto_price,createTime) VALUES ('${orderid}', '${imei}', '${totalprice}', '${time.getTime()}');
  `
      mysql(sql)
        .then(data => {
          addfixitem(info, orderid)
          res.json({
            code: 200,
            message: '创建成功'
          })
        })
        .catch(err => {
          res.json({
            code: 600,
            message: '创建失败' + err
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

app.use('/GETFIXORDERITEM', (req, res, next) => {
  let {
    orderid
  } = req.body
  let sql = `select fo.order_id,f.model_name as shopname,f.model_img as shopimg,fi.item_id,fi.item_name,fo.man_price as price from fixorderitem o,fixmodel f,fixitem fi,fixorder fo WHERE o.order_id = '${orderid}' and fo.order_id = o.order_id and o.model_id = f.model_id and fi.item_id = o.item_id`
  mysql(sql)
    .then(data => {
      data = JSON.parse(JSON.stringify(data))
      let result = []
      data.forEach(el => {
        let index = result.findIndex(els => {
          return el.order_id == els.order_id
        })
        if (index == -1) {
          const d = {
            order_id: el.order_id,
            shopname: el.shopname,
            path: imgutil.imgtobase(`./public${el.shopimg}`),
            price: el.price,
            count: 1,
            sku: [{
              item_name: el.item_name
            }]
          }
          result.push(d)
        } else {
          result[index].sku.push({
            item_name: el.item_name
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

module.exports = app