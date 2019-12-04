const express = require("express");
const graphql = require('graphql');
const egraph = require('express-graphql')
const mysql = require('../util/db')
const img = require('../util/img')
const router = express();
const imgutil = new img();

let schema = graphql.buildSchema(`
  type adInfo{
    id: ID!,
    adid:Int,
    adimg:String,
    create_time:String,
    startdue:String,
    overdue:String,
    priority:Int,
    shopid:String,
    clickcount:Int,
    create_man:String
  },
  input adinfo{
    adid:Int,
    adimg:String,
    create_time:String,
    startdue:String,
    overdue:String,
    priority:Int,
    shopid:String,
    clickcount:Int,
    create_man:String
  },
  type Query{
      adinfos(id:ID!):[adInfo]
  }
  type Mutation{
      insertAd(input:adinfo):adInfo
      updateAD(id:ID!,input:adinfo):adInfo
  }
`)
/**
 * 
 * @param {*} String Base64格式图片
 * return 存储路径 localhost:3000/ad/..
 * (命名规则)
 */
const saveImg = (string) => {
  return imgutil.saveImg("./public/ad/", string)
}
var root = {
  adinfos({id}) {
    return new Promise((resolve, reject) => {
      mysql.query("select * from adinfo where id= ?", id ,(err, data) => {
        if (err) {
          reject(err)
        }
        resolve(data)
      })
    })
  },
  insertAd({
    input
  }) {
    const data = {
      adid: input.adid,
      adimg: saveImg(input.adimg),
      create_time: new Date(),
      startdue: new Date(input.startdue),
      overdue: new Date(input.overdue),
      priority: input.priority,
      shopid: input.shopid,
      clickcount: 0,
      create_man: input.create_man,
    }
    mysql.query("insert into adinfo set ?", data, (err, data) => {
      if (err) {
        console.log("发生错误" + err.message)
        return JSON.stringify({
          code: "410",
          message: "失败"+err.message
        })
      }
      return JSON.stringify({
        code: "200",
        message: "success"
      })
    })
  },
  updateAd({
    id,
    adid,
    adimg,
    startdue,
    overdue,
    clickcount,
    create_man
  }){
     
  }
}
router.use("/", egraph({
  schema: schema,
  rootValue: root,
  graphiql: true
}))

module.exports = router;