const express = require("express");
const graphql = require('graphql');
const egraph = require('express-graphql')
const mysql = require('../../util/db')
const router = express();

var schema=graphql.buildSchema(`
  type brandInfo{
    brandid:ID!,
    brandname:String,
    brandename:String,
    isfix:Int
  }  
  type Query{
      brandInfo:[brandInfo]
  }
  input inputBrand{
    brandid:ID!,
    brandname:String,
    brandename:String,
    isfix:Int
  }
  type Mutation{
      insertBrand(input:inputBrand):brandInfo
      updateBrand(input:inputBrand):brandInfo
  }
`)

var root={
    brandInfo(){
        return new Promise((resolve,reject)=>{
        mysql.query("select * from brandinfo",(err,data)=>{
            if (err) {
              reject(err)
            }
            resolve(data)
        })
    })
    },
    insertBrand({
      input
    }){
        const data = {
          brandid:input.brandid,
          brandname:input.brandname,
          brandename:input.brandename,
          isfix:input.isfix
        }
        return new Promise((resolve,reject)=>{
        mysql.query("insert into brandinfo set ?",data,(err,) => {
           if (err) {
               reject(JSON.stringify({
                   code:"410",
                   message:`失败${err}`
               }))
           } else {
               resolve(JSON.stringify({
                   code:'200',
                   message:'success'
               }))
           }
        })
      }) 
    },
    updateBrand({
      input
    }){
      const data={
        brandname:input.brandname,
        brandename:input.brandename,
        isfix:input.isfix
      }
      return new Promise((resolve,reject)=>{
      mysql.query("update brandinfo set ? where brandid = ?",[data,input.brandid],(err,data)=>{
        if(err){
          reject(JSON.stringify({
            code:"410",
            message:err
          }))
        } else {
          resolve(JSON.stringify({
            code:"200",
            message:"success"
          }))
        }
      })
    })
    }
}

router.use("/",egraph({
    schema:schema,
    rootValue:root,
    graphiql:true
}))

module.exports=router