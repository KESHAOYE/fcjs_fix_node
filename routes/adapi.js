const express=require("express");
const graphql=require('graphql');
const egraph=require('express-graphql')
const mysql=require('../util/db')
const img=require('../util/img')
const router=express();
const imgutil=new img();

let schema=graphql.buildSchema(`
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
      adinfos:[adInfo]
  }
  type Mutation{
      insertAd(input:adinfo):adInfo
  }
`)
/**
 * 
 * @param {*} String Base64格式图片
 * return 存储路径 localhost:3000/ad/..
 * (命名规则)
 */
const saveImg=(string)=>{
   return imgutil.saveImg("./public/ad/",string)
}
var root={
    adinfos(){
      return new Promise((resolve,reject)=>{
       mysql.query("select * from adinfo",(err,data)=>{
          if(err){
            reject(err)
          }
          resolve(data)
       })
      })
    },
    insertAd({input}){
        const data={
            id:"1",
            adid:input.adid,
            adimg:saveImg(input.adimg),
            create_time:new Date(),
            startdue:new Date(input.startdue),
            overdue:new Date(input.overdue),
            priority:input.priority,
            shopid:input.shopid,
            clickcount:0,
            create_man:input.create_man,
        }  
        return new Promise((resolve,reject)=>{
        mysql.query("insert into adinfo set ?",data,(err,data)=>{
            if(err){
              console.log("发生错误"+err.message)
              reject(err)
            }
            resolve(data)
            return JSON.stringify({
                code:"200",
                message:"success"
            })
        })
      })
    }
}

router.use("/",egraph({
    schema:schema,
    rootValue:root,
    graphiql:true
}))

module.exports=router;