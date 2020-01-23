const express = require("express");
const mysql = require('../../util/db')
const app = express();
const uuid = require('node-uuid')
const token = require('../../util/token')
const tokens = new token()

// 通过分类获取
app.use('/GETCOUPONBYSORT', (req, res, next) => {
    let { sort } = req.body
    let sql = sort == 'all' ? `select * from coupon` : `select * from coupon where use_type = ${sort}`
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
        let { type, amount, per_limit, min_price, start_time, over_time, use_type, note, public_count, get_date, shop_id, sort_id, phone } = req.body
        let couponid = uuid.v1()
        let _t_ = req.headers.authorization
        let t = tokens.checkToken(_t_, phone)
        t.then(data => {
            let sql = {
                // 全场通用
                0: `insert into coupon(coupon_id,type,amount,per_limit,min_price,start_time,over_time,use_type,note,public_count,get_date) 
        values('${couponid}','${type}','${amount}','${per_limit}','${min_price}','${start_time}','${over_time}','${use_type}','${note}','${public_count}','${get_date}')`,
                // 指定商品
                1: `DROP PROCEDURE IF EXISTS couponshop;
        CREATE PROCEDURE couponshop(
         IN coupon_id VARCHAR(255),
         IN type TINYINT(1),
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
        insert into coupon(coupon_id,type,amount,per_limit,min_price,start_time,over_time,use_type,note,public_count,get_date) values(coupon_id,type,amount,per_limit,min_price,start_time,over_time,use_type,note,public_count,get_date);
        SELECT MAX(id) from coupon INTO coupon_temp_id;
        insert into coupon_shop(coupon_id,shop_id) VALUES(coupon_temp_id,shop_id);
        END;
        call couponshop('${couponid}','${type}','${amount}','${per_limit}','${min_price}','${start_time}','${over_time}','${use_type}','${note}','${public_count}','${get_date}','${shop_id}')`,
                2: `DROP PROCEDURE IF EXISTS couponsort;
        CREATE PROCEDURE couponsort(
         IN coupon_id VARCHAR(255),
         IN type TINYINT(1),
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
        insert into coupon(coupon_id,type,amount,per_limit,min_price,start_time,over_time,use_type,note,public_count,get_date) values(coupon_id,type,amount,per_limit,min_price,start_time,over_time,use_type,note,public_count,get_date);
        SELECT MAX(id) from coupon INTO coupon_temp_id;
        insert into coupon_sort(coupon_id,sort_id) VALUES(coupon_temp_id,sort_id);
        END;
        call couponshop('${couponid}','${type}','${amount}','${per_limit}','${min_price}','${start_time}','${over_time}','${use_type}','${note}','${public_count}','${get_date}','${sort_id}')`,
            }[use_type]
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
        })
        return
    })
    .catch(err => {
        res.json({
            code: 600,
            status: false,
            message: '授权失败'
        })
    })
    // 修改活动 / 优惠券
    // 只可修改 时间 以及领取上限
app.use('/UPDATECOUPON', (req, res, next) => {
        let { start_time, over_time, per_limit, public_count, id } = req.body
        let _t_ = req.headers.authorization
        let t = tokens.checkToken(_t_, phone)
        t.then(data => {
                let sql = `update coupon set start_time = ${start_time} , over_time = ${over_time}, per_limit = ${per_limit}, public_count = ${public_count} where id = ${id}`
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
                    code: 600,
                    status: false,
                    message: '授权失败'
                })
            })
    })
    // 用户领取
app.use('USERGETCOUPON', (req, res, next) => {
    let { id, phone, getType } = req.body
    let _t_ = req.headers.authorization
    let t = tokens.checkToken(_t_, phone)
    t.then(data => {
            let s = `select public_count as pcount,receive_count as rcount from coupon where coupon_id = ${id}`
            let sql = `drop DECLARE PROCEDURE IF EXISTS usergetcoupon
            CREATE PROCEDURE usergetcoupon(
             IN phone VARCHAR(20)
             IN couponid VARCHAR(255),
             IN getType TINYINT(1)
            )
            BEGIN
            DECLARE userid VARCHAR(255);
            select user_id INTO userid from userinfo where phone = phone
            DECLARE rcount INT
            SELECT receive_count INTO rcount from coupon where coupon_id = couponid
            
            UPDATE coupon set receive_count = count + 1 where coupon_id = couponid
            INSERT INTO usercoupon(couponid,userid,get_type,createTime) VALUES(couponid,userid,getType,NOW())
            END;
            CALL usergetcoupon(${phone},${id},${getType})`
            mysql(s)
                .then(data => {
                    if (data[0].rcount >= data[0].pcount) {
                        res.json({
                            code: 600,
                            message: '对不起，该优惠券已领完!'
                        })
                        return new Promise.reject('false')
                    }
                })
                .then(() => {
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
                                message: '领取失败'
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
        .catch(err => {
            res.json({
                code: 600,
                status: false,
                message: '授权失败'
            })
        })
})

module.exports = app