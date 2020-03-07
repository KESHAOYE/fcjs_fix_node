const express = require("express");
const mysql = require('../../util/db')
const app = express();
const token = require('../../util/token')
const tokens = new token()
const time = require('../../util/time')
const uuid = require('node-uuid')
const img = require('../../util/img')
const imgutil = new img()

app.use('/LIKE', (req, res, next) => {
  let {
    commentid,
    userid
  } = req.body
  let sql = `
  insert into likes(commentid,userid) values('${commentid}','${userid}');
  update comment_info set likes = likes + '1' where commentid = '${commentid}'`
  mysql(sql)
    .then(data => {
      res.json({
        code: 200,
        message: '点赞成功'
      })
    })
    .catch(err => {
      res.json({
        code: 600,
        message: '点赞失败' + err
      })
    })
})

app.use('/GETCOMMENT', (req, res, next) => {
  let {
    page,
    pageSize,
    shopid,
    userid
  } = req.body
  let start = (page - 1) * pageSize
  let sql = `select c.commentid,c.comment,c.score,c.comment_time,c.isshow as cshow,c.delete as cdelete,c.likes,c.comment_img,s.sku_concat,u.username,u.headimg,(select count(*) from likes where userid = '${userid}' and commentid = c.commentid) as islike from comment_info c,sku_stock s,userinfo u where c.shopid = '${shopid}' and c.sku_id = s.id and c.userid = u.user_id group by c.commentid limit ${start},${pageSize * page}`
  mysql(sql)
    .then(data => {
      data = JSON.parse(JSON.stringify(data))
      data.forEach((el, index) => {
        console.log(data[index])
        data[index].headimg = data[index].headimg == null ? 'http://localhost:3000/userHead/default.png' : `http://localhost:3000${data[0][index].headimg}`
        if (data[index].comment_img.length > 0 && data[index].comment_img != 'undefined'){
          data[index].comment_img = data[index].comment_img.replace(/data:image\/jpeg;base64,/g, '')
        data[index].comment_img = data[index].comment_img.split(',')
        data[index].comment_img.forEach((el, indexs) => {
          console.log(el == '');
          if (el == "") {
            data[index].comment_img.splice(indexs, 1)
          } else {
            data[index].comment_img[indexs] = 'data:image/jpeg;base64,' + el
          }
        })
      }
      })

      res.json({
        code: 200,
        info: data
      })
    })
    .catch(err => {
      res.json({
        code: 600,
        message: err
      })
    })
})

app.use('/GETFIRST', (req, res, next) => {
  let {
    shopid,
    userid
  } = req.body
  let sql = `select c.commentid,c.comment,c.score,c.comment_time,c.isshow as cshow,c.delete as cdelete,c.likes,c.comment_img,s.sku_concat,u.username,u.headimg,(select count(*) from likes where userid = '${userid}' and commentid = c.commentid) as islike from comment_info c,sku_stock s,userinfo u where c.shopid = '${shopid}' and c.sku_id = s.id and c.userid = u.user_id group by c.commentid limit 1;
    select count(*) as good from comment_info where score > 3 and shopid = '${shopid}';
    select count(*) as middle from comment_info where score >1 and score <= 3 and shopid = '${shopid}';
    select count(*) as nogood from comment_info where score <=1 and shopid = '${shopid}';
    select count(*) as picture from comment_info where LENGTH(comment_img)>0 and shopid = '${shopid}';
    select count(*) as count from comment_info where shopid = '${shopid}';
    `
  mysql(sql)
    .then(data => {
      data = JSON.parse(JSON.stringify(data))
      data[0].forEach((el, index) => {
        console.log(data[0][index].headimg);
        data[0][index].headimg = data[0][index].headimg == null ? 'http://localhost:3000/userHead/default.png' : `http://localhost:3000${data[0][index].headimg}`
        if (data[0][index].comment_img.length > 0)
          data[0][index].comment_img = data[0][index].comment_img.replace(/data:image\/jpeg;base64,/g, '')
          data[0][index].comment_img = data[0][index].comment_img.split(',')
          data[0][index].comment_img.forEach((el, indexs) => {
          if (el == "") {
            data[0][index].comment_img.splice(indexs, 1)
          } else {
            data[0][index].comment_img[indexs] = 'data:image/jpeg;base64,' + el
          }
        })
      })
      const da = {
        comment: data[0],
        good: data[1][0].good,
        middle: data[2][0].middle,
        bad: data[3][0].nogood,
        picture: data[4][0].picture,
        commentCount: data[5][0].count
      }
      res.json({
        code: 200,
        info: da
      })
    })
})

app.use('/ADDCOMMENT', (req, res, next) => {
  let {
    userid,
    orderid,
    info
  } = req.body
  let _t_ = req.headers.authorization
  let phone = req.headers.phone
  let t = tokens.checkToken(phone, _t_)
  t.then(data => {
    let sql = ''
    for (let i = 0; i < info.length; i++) {
      sql += `INSERT INTO comment_info(shopid, sku_id, comment, userid, comment_time, score,comment_img) VALUES ('${info[i].shop_id}', ${info[i].sku_id}, '${info[i].content}', '${userid}', '${time.getTime()}',${info[i].rate} ,'${info[i].shopimg}');
      `
    }
    sql += `update orderinfo o set o.order_state = 7 where o.order_id = '${orderid}';
    insert into order_state(order_id,now_state,createTime) values('${orderid}','7','${time.getTime()}');
    `
    mysql(sql)
      .then(data => {
        res.json({
          code: 200,
          message: '评论成功'
        })
      })
      .catch(err => {
        res.json({
          code: 600,
          message: '评论失败' + err
        })
      })
  }).catch(err => {
    res.json({
      code: 601,
      message: '你没有权限'
    })
  })
})

module.exports = app;