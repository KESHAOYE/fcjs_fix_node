const express = require("express");
const mysql = require('../../util/db')
const app = express();
const token = require('../../util/token')
const tokens =new token()
const time = require('../../util/time')
const img = require('../../util/img')
const imgutil = new img()


// 获取分类
app.use('/GETSORT', (req, res, next) => {
    let sql = `select * from sortinfo 
    left join shopinfo on sortinfo.sortid = shopinfo.shopsort 
    left join (select * from shopimg group by shopid) as b on b.shopid = shopinfo.shop_id where shopinfo.deletes = 0`
    let result = []
    mysql(sql)
        .then(data => {
            let b = []
            data.forEach((cur)=>{
                let index = b.findIndex((item) => item.sortid == cur.sortid)
                if (index != -1) {
                    let object = {
                        shopid: cur.shop_id,
                        shopname: cur.shopname,
                        shopimg: imgutil.imgtobase(`./public${cur.path}`)
                    }
                    b[index].data.push(object)
                } else {
                    let object = {
                        sortid: cur.sortid,
                        sortname: cur.sortname,
                        sortename: cur.sortename,
                        data: []
                    }
                    if(cur.shop_id!=null){
                       object.data.push({
                        shopid: cur.shop_id,
                        shopname: cur.shopname,
                        shopimg: imgutil.imgtobase(`./public${cur.path}`)
                    })
                    }
                    b.push(object)
                }
            })
            res.json({
                code: 200,
                status: true,
                info: b
            })
        })
        .catch(err => {
            res.json({
                code: 600,
                message: err
            })
        })
})

app.use('/GETSORTS',(req,res,next)=>{
    let {sortname, page, pageSize} = req.body
    let start = (page-1)*pageSize
  let sql = sortname == ''? `select * from sortinfo limit ${start},${pageSize*page}` : `select * from sortinfo where sortname like '%${sortname}%' or sortename like '%${sortname}%' limit ${start},${pageSize*page}`
  let sq = sortname == ''? `select count(*) as count from sortinfo ` : `select count(*) as count from sortinfo where sortname like '%${sortname}%' or sortename like '%${sortname}%'`
    mysql(sql)
    .then(da=>{
        mysql(sq).then(data=>{
          res.json({
            code:200,
            count: JSON.parse(JSON.stringify(data))[0].count,
            info: da
        })
        })
    })
  .catch(err=>{
      res.json({
          code: 600,
          message: err
      })
  })

})

app.use('/GETSORTBYID',(req,res,next)=>{
  let {sortid} = req.body
  let sql = `select * from sortinfo where sortid = ${sortid}`
    mysql(sql)
    .then(da=>{
          res.json({
            code:200,
            info: da
        })
    })
  .catch(err=>{
      res.json({
          code: 600,
          message: err
      })
  })

})
//添加分类

app.use('/ADDSORT', (req, res, next) => {
    let {
        sortname,
        sortename,
        isshow
    } = req.body
    let _t_ = req.headers.authorization
    let roleid = req.headers.roleid
    let phone = req.headers.phone
    let t = tokens.checkAdminToken(phone, _t_,roleid)
    const ct = time.getTime()
    t.then(data => {
            let sql = `insert into sortinfo(sortname,sortename,isshow,createTime) values('${sortname}','${sortename}','${isshow}','${ct}')`
            mysql(sql).then(data => {
                    res.json({
                        code: 200,
                        message: '添加成功'
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
                code: 601,
                message: '你没有权限' + err
            })
        })
})

//改变分类

app.use('/UPDATESORT', (req, res, next) => {
    let {
        sortid,
        sortname,
        sortename,
        isshow
    } = req.body
    let _t_ = req.headers.authorization
    let roleid = req.headers.roleid
    let phone = req.headers.phone
    let t = tokens.checkAdminToken(phone, _t_,roleid)
    t.then(data => {
            let sql = `update sortinfo set sortname= '${sortname}',sortename = '${sortename}',isshow = '${isshow}' where sortid = '${sortid}'`
            mysql(sql).then(data => {
                    res.json({
                        code: 200,
                        message: '修改成功'
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
                code: 601,
                message: '你没有权限' + err
            })
        })
})

//删除分类

app.use('/DELETESORT', (req, res, next) => {
    let { sortid } = req.body
    let _t_ = req.headers.authorization
    let roleid = req.headers.roleid
    let phone = req.headers.phone
    let t = tokens.checkAdminToken(phone, _t_,roleid)
    t.then(data => {
            let sql = `update sortinfo set isshow = ${0} where sortid = ${sortid}`
            mysql(sql).then(data => {
                    res.json({
                        code: 200,
                        message: '删除成功'
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
                code: 601,
                message: '你没有权限' + err
            })
        })
})

module.exports = app