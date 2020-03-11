const express = require("express");
const mysql = require('../../util/db')
const app = express();
const token = require('../../util/token')
const tokens = new token()
const time = require('../../util/time')
const uuid = require('node-uuid')
const img = require('../../util/img')
const imgutil = new img()

app.use('/ADDSHOPCAR', (req, res, next) => {
    let {
        userid,
        shopid,
        sku_id,
        count
    } = req.body
    let sql = `DROP PROCEDURE IF EXISTS addshopcar;
    CREATE PROCEDURE addshopcar(
     IN shop_id VARCHAR(255),
     IN sku_id INT(11),
     IN user_id VARCHAR(255),
     IN counts INT(11)
    )
    begin
    DECLARE price DECIMAL(10,2);
		DECLARE count INT DEFAULT 0;
		select count(*) INTO count from shopcar s where s.userid = user_id and s.shopid = shop_id and s.sku_id = sku_id and s.state = 0;
    select s.price INTO price from sku_stock s,shopinfo si where si.shop_id = shop_id and s.id = sku_id and s.shop_id = si.shop_id;
		IF count > 0 THEN
		UPDATE shopcar s SET s.count = s.count + counts,s.price = s.price + price where userid = user_id and shopid = shop_id and sku_id = sku_id;
		ELSE
    INSERT INTO shopcar(shopid, sku_id, userid, count, price) VALUES(shop_id, sku_id, user_id, counts, price);
		end IF;
    END;
    call addshopcar('${shopid}','${sku_id}','${userid}','${count}')`
    mysql(sql)
        .then(data => {
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

app.use('/GETSHOPCAR', (req, res, next) => {
    let {
        userid
    } = req.body
    let sql = `select sc.id,sm.path as shopimg,si.shop_id as shopid,ss.id as sku_id,sc.count,si.shopname,ss.sku_concat as sku_name,sc.price,ss.price as per_price from shopcar sc,shopinfo si,shopimg sm,sku_stock ss where sc.userid= '${userid}' and sc.shopid = si.shop_id and sm.shopid = si.shop_id and ss.id = sc.sku_id and sc.state = 0 GROUP BY id `
    mysql(sql)
        .then(data => {
            data = JSON.parse(JSON.stringify(data))
            data.forEach((el, index) => {
                data[index].shopimg = imgutil.imgtobase(`./public${el.shopimg}`)
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

app.use('/DELETESHOPCAR', (req, res, next) => {
    let {
        userid,
        shopid,
        sku_id
    } = req.body
    let sql = `UPDATE shopcar s SET s.state = 2 where userid = '${userid}' and shopid = '${shopid}' and sku_id = '${sku_id}';`
    mysql(sql)
        .then(data => {
            res.json({
                code: 200,
                message: '成功'
            })
        })
        .catch(err => {
            res.json({
                code: 600,
                message: '失败'
            })
        })
})

module.exports = app;