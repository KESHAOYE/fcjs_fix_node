const express = require("express");
const mysql = require('../../util/db')
const app = express();
const token = require('../../util/token')
const tokens = new token()
const time = require('../../util/time')
const uuid = require('node-uuid')
const img = require('../../util/img')
const imgutil = new img()

app.use('/LIKE',(req,res,next)=>{
  let {commentid,userid} = req.body
  let sql = `
  insert into likes(commentid,userid) values('${commentid}','${userid}');
  update comment_info set likes = likes + '1' where commentid = '${commentid}'`
  mysql(sql)
  .then(data=>{
    res.json({
      code: 200,
      message: '点赞成功'
    })
  })
  .catch(err=>{
    res.json({
      code: 600,
      message: '点赞失败'+err
    })
  })
})

app.use('/GETCOMMENT',(req,res,next)=>{
   let {page,pageSize,shopid,userid} = req.body
   let start = (page - 1) * pageSize
   let sql = `select c.commentid,c.comment,c.score,c.comment_time,c.isshow as cshow,c.delete as cdelete,c.likes,c.comment_img,s.sku_concat,u.username,u.headimg,(select count(*) from likes where userid = '${userid}' and commentid = c.commentid) as islike from comment_info c,sku_stock s,userinfo u where c.shopid = '${shopid}' and c.sku_id = s.id and c.userid = u.user_id group by c.commentid limit ${start},${pageSize * page}`
   mysql(sql)
   .then(data=>{
     data.forEach((el,index)=>{
      data[index].headimg = data[index].headimg == null? 'http://localhost:3000/userHead/default.png':data[index].headimg
     })
     res.json({
       code: 200,
       info: data
     })
   })
   .catch(err=>{
     res.json({
      code: 600,
      message: err  
    })
   })
})

app.use('/GETFIRST',(req,res,next) => {
    let {shopid,userid} = req.body
    let sql = `select c.commentid,c.comment,c.score,c.comment_time,c.isshow as cshow,c.delete as cdelete,c.likes,c.comment_img,s.sku_concat,u.username,u.headimg,(select count(*) from likes where userid = '${userid}' and commentid = c.commentid) as islike from comment_info c,sku_stock s,userinfo u where c.shopid = '${shopid}' and c.sku_id = s.id and c.userid = u.user_id group by c.commentid limit 1;
    select count(*) as good from comment_info where score > 3 and shopid = '${shopid}';
    select count(*) as middle from comment_info where score >1 and score <= 3 and shopid = '${shopid}';
    select count(*) as nogood from comment_info where score <=1 and shopid = '${shopid}';
    select count(*) as picture from comment_info where LENGTH(comment_img)>0 and shopid = '${shopid}';
    select count(*) as count from comment_info where shopid = '${shopid}';
    `
    mysql(sql)
    .then(data=>{
      data = JSON.parse(JSON.stringify(data))
      data[0][0]&&data[0][0].comment_img.length>0&&data[0][0].comment_img.forEach((el,index)=>{
        data[0][0].comment_img[index] = imgutil.imgtobase(`./public${el}`)  
      })
      data[0][0].headimg = data[0][0].headimg == null? 'http://localhost:3000/userHead/default.png':data[0][0].headimg 
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
        info:da
      })
    })
})

module.exports = app;