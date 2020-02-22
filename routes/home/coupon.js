const express = require("express");
const mysql = require('../../util/db')
const app = express();
const uuid = require('node-uuid')
const token = require('../../util/token')
const tokens = new token()
const time = require('../../util/time')

app.use('/GETCOUPONBYID', (req, res, next) => {
    let {
        coupon_id,
        use_type
    } = req.body
    let sql = {
        1: `select c.coupon_id,c.use_type,c.get_date,c.amount,c.min_price,c.public_count,c.start_time,c.note,c.per_limit,c.over_time,s.shop_id,s.shopname from coupon c,shopinfo s,coupon_shop cs where c.coupon_id = '${coupon_id}' and cs.coupon_id = c.coupon_id and cs.shop_id = s.shop_id and isshow = 0`,
        2: `select c.coupon_id,c.use_type,c.get_date,c.min_price,c.public_count,c.start_time,c.over_time,s.sortid,s.sortname from coupon c,sortinfo s,coupon_sort cs where c.coupon_id = 1 and cs.coupon_id = c.coupon_id and c.coupon_id = '${coupon_id}' and cs.sort_id = s.sortid and c.isshow = 0`,
        0: `select * from coupon where coupon_id = '${coupon_id}' and isshow = 0`,
        undefined: `select * from coupon where coupon_id = '${coupon_id}' and isshow = 0`
    } [use_type]
    mysql(sql)
        .then(data => {
            res.json({
                code: 200,
                status: true,
                info: data
            })
        })
        .catch(err => {
            res.json({
                code: 600,
                status: false,
                message: err
            })
        })
})
// 通过分类获取
app.use('/GETCOUPONBYSORT', (req, res, next) => {
    let {
        sort
    } = req.body
    let sql = sort == 'all' ? `select * from coupon where isshow = 0` : `select * from coupon where use_type = ${sort} and isshow = 0`
    mysql(sql)
        .then(data => {
            res.json({
                code: 200,
                status: true,
                info: data
            })
        })
        .catch(err => {
            res.json({
                code: 600,
                status: false,
                message: err
            })
        })
})

app.use('/GETCOUPONS',(req,res,next)=>{
  let {count} = req.body
  let sql = `select * from coupon where isshow = 0 and DATE(over_time) >= '${time.getTime()}' and get_date >= '${time.getTime()}' limit 0,${count}`
  mysql(sql)
        .then(data => {
            res.json({
                code: 200,
                status: true,
                info: data
            })
        })
        .catch(err => {
            res.json({
                code: 600,
                status: false,
                message: err
            })
        })
})

// 添加活动 / 优惠券
app.use('/ADDCOUPON', (req, res, next) => {
    let {
        amount,
        per_limit,
        min_price,
        date,
        use_type,
        note,
        public_count,
        get_date,
        shopid,
        sortid
    } = req.body
    let couponid = uuid.v1()
    let _t_ = req.headers.authorization
    let roleid = req.headers.roleid
    let phone = req.headers.phone
    let t = tokens.checkAdminToken(phone, _t_, roleid)
    let start_time = time.getTime(date[0])
    let over_time = time.getTime(date[1])
    get_date = time.getTime(get_date)
    t.then(data => {
            let sql = {
                // 全场通用
                0: `insert into coupon(coupon_id,amount,per_limit,min_price,start_time,over_time,use_type,note,public_count,get_date) 
        values('${couponid}','${amount}','${per_limit}','${min_price}','${start_time}','${over_time}','${use_type}','${note}','${public_count}','${get_date}')`,
                // 指定商品
                1: `DROP PROCEDURE IF EXISTS couponshop;
        CREATE PROCEDURE couponshop(
         IN coupon_id VARCHAR(255),
         IN amount DECIMAL(10,2),
         IN per_limit INT(11),
         IN min_price DECIMAL(10,2),
         IN start_time DATETIME(6),
         IN over_time DATETIME(6),
         IN use_type VARCHAR(255),
         IN note VARCHAR(255),
         IN public_count INT(11),
         IN get_date DATETIME(6),
         IN shop_id VARCHAR(255)
        )
        begin
        DECLARE coupon_temp_id int;
        insert into coupon(coupon_id,amount,per_limit,min_price,start_time,over_time,use_type,note,public_count,get_date) values(coupon_id,amount,per_limit,min_price,start_time,over_time,use_type,note,public_count,get_date);
        insert into coupon_shop(coupon_id,shop_id) VALUES(coupon_id,shop_id);
        END;
        call couponshop('${couponid}','${amount}','${per_limit}','${min_price}','${start_time}','${over_time}','${use_type}','${note}','${public_count}','${get_date}','${shopid}')`,
                2: `DROP PROCEDURE IF EXISTS couponsort;
        CREATE PROCEDURE couponsort(
         IN coupon_id VARCHAR(255),
         IN amount DECIMAL(10,2),
         IN per_limit INT(11),
         IN min_price DECIMAL(10,2),
         IN start_time DATETIME(6),
         IN over_time DATETIME(6),
         IN use_type VARCHAR(255),
         IN note VARCHAR(255),
         IN public_count INT(11),
         IN get_date DATETIME(6),
         IN sort_id INT(11)
        )
        begin
        DECLARE coupon_temp_id int;
        insert into coupon(coupon_id,amount,per_limit,min_price,start_time,over_time,use_type,note,public_count,get_date) values(coupon_id,amount,per_limit,min_price,start_time,over_time,use_type,note,public_count,get_date);
        insert into coupon_sort(coupon_id,sort_id) VALUES(coupon_id,sort_id);
        END;
        call couponsort('${couponid}','${amount}','${per_limit}','${min_price}','${start_time}','${over_time}','${use_type}','${note}','${public_count}','${get_date}','${sortid}')`,
            } [use_type]
            mysql(sql)
                .then(data => {
                    if (data) {
                        res.json({
                            code: 200,
                            status: true,
                            message: '添加成功'
                        })
                    }
                })
                .catch(err => {
                    res.json({
                        code: 600,
                        status: false,
                        message: `添加失败${err}`
                    })
                })
            return
        })
        .catch(err => {
            res.json({
                code: 601,
                status: false,
                message: '授权失败' + err
            })
        })
})

// 修改活动 / 优惠券
// 只可修改 时间 以及领取上限
app.use('/UPDATECOUPON', (req, res, next) => {
    let {
        date,
        per_limit,
        public_count,
        coupon_id
    } = req.body
    let _t_ = req.headers.authorization
    let phone = req.headers.phone
    let roleid = req.headers.roleid
    let t = tokens.checkAdminToken(phone, _t_, roleid)
    let start_time = time.getTime(date[0])
    let over_time = time.getTime(date[1])
    t.then(data => {
            let sql = `update coupon set start_time = '${start_time}' , over_time = '${over_time}', per_limit = '${per_limit}', public_count = '${public_count}' where coupon_id = '${coupon_id}'`
            mysql(sql)
                .then(data => {
                    if (data) {
                        res.json({
                            code: 200,
                            status: true,
                            message: '修改成功'
                        })
                    }
                })
                .catch(err => {
                    res.json({
                        code: 600,
                        status: false,
                        message: `修改失败${err}`
                    })
                })
            return
        })
        .catch(err => {
            res.json({
                code: 601,
                status: false,
                message: `授权失败${err}`
            })
        })
})
// 获取商品适用的优惠券
app.use('/GETSHOPCOUPON', (req, res, next) => {
    let {
        shopid,
        sortid
    } = req.body
    let sql = `select c.id,c.coupon_id,c.note,c.amount,c.min_price from coupon c where c.coupon_id = any(
        select coupon_id from coupon_shop where shop_id = '${shopid}'
      )  or c.coupon_id = any(select coupon_id from coupon_sort where sort_id = '${sortid}') or c.use_type = '0'  and c.get_date >= '${time.getTime()}' GROUP BY c.coupon_id`
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
// 用户领取
app.use('/USERGETCOUPON', (req, res, next) => {
    let {
        id
    } = req.body
    let _t_ = req.headers.authorization
    let phone = req.headers.phone
    let t = tokens.checkToken(phone, _t_)
    t.then(data => {
        let s = `select public_count as pcount,receive_count as rcount from coupon where coupon_id = '${id}'`
        let a = `select count(*) as count from usercoupon where coupon_id = '${id}'`
        let sql = `DROP PROCEDURE IF EXISTS usergetcoupon;
        CREATE PROCEDURE usergetcoupon(
         IN phone VARCHAR(20),
         IN couponid VARCHAR(255)
        )
        BEGIN
        DECLARE userid VARCHAR(255);
        DECLARE rcount INT;
        select u.user_id INTO userid from userinfo u where u.phone = phone;
        SELECT c.receive_count INTO rcount from coupon c where c.coupon_id = couponid;
        UPDATE coupon c set c.receive_count = rcount + 1 where c.coupon_id = couponid;
        INSERT INTO usercoupon(coupon_id,user_id,createTime) VALUES(couponid,userid,'${time.getTime()}');
        END;
        CALL usergetcoupon('${phone}','${id}')`
        mysql(s)
            .then(data => {
                data = JSON.parse(JSON.stringify(data))
                if (data[0].rcount >= data[0].pcount) {
                    res.json({
                        code: 600,
                        message: '对不起，该优惠券已领完!'
                    })
                } else {
                    mysql(a)
                        .then(data => {
                            data = JSON.parse(JSON.stringify(data))
                            if (data[0].count > 0) {
                                res.json({
                                    code: 600,
                                    message: ',您已领取过此优惠券!'
                                })
                            } else {
                                mysql(sql)
                                    .then(data => {
                                        res.json({
                                            code: 200,
                                            message: '领取成功'
                                        })
                                    })
                                    .catch(err => {
                                        res.json({
                                            code: 600,
                                            message: '领取失败' + err
                                        })
                                    })
                            }
                        })
                }
            })
    }).catch(err => {
        res.json({
            code: 600,
            status: false,
            message: '授权失败'
        })
    })
})

app.use('/GETUSERCOUPON', (req, res, next) => {
    let {
        userid,
        type
    } = req.body
    let sql = `SELECT * FROM usercoupon uc,coupon c where uc.user_id = '${userid}' and uc.coupon_id = c.coupon_id and uc.use_status = '${type}'`
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
                message: `获取失败${err}`
            })
        })
})

// 删除优惠券
app.use('/DELETECOUPON', (req, res, next) => {
    let {
        coupon_id
    } = req.body
    let _t_ = req.headers.authorization
    let phone = req.headers.phone
    let roleid = req.headers.roleid
    let t = tokens.checkAdminToken(phone, _t_, roleid)
    t.then(data => {
            let sql = `update coupon set isshow = '1' where coupon_id = '${coupon_id}'`
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
                        message: `删除失败${err}`
                    })
                })
        })
        .catch(err => {
            res.json({
                code: 601,
                message: '您没有权限'
            })
        })
})

module.exports = app