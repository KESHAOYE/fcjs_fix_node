const express = require("express");
const graphql = require('graphql');
const egraph = require('express-graphql')
const mysql = require('../../util/db')
const router = express();

var schema = graphql.buildSchema(`
 type sort{
   sortid: ID!,
   sortname: String,
   sortename: String,
   createTime: String,
   isshow: Int
 }
 type Query{
   getSort:[sort]
 }
 input inputsort{
   sortid: ID!,
   sortname: String,
   sortename: String,
   createTime: String,
   isshow: Int
 }
type Mutation{
   insertSort(input: inputsort) :sort
   updateSort(id:ID!,input: inputsort) :sort
}
`)

var root = {
  getsort(){
    return new Promise((resolve, reject)=>{
    mysql.query('select * from shopinfo where sorid = (select * from sortInfo)',(err,data)=>{
        if(err){
          reject(new Error(err))
        }else{
            resolve(data)
        }
    })
    })  
  },
  insertSort({input}){
    const data = {
      sortname: input.sortname,
      sortename: input.sortename,
      createTime: new Date(),
      isshow: input.isshow
    }
    return new Promise((resolve,reject)=>{
      mysql.query('insert into sortInfo set ?',data, (err,data)=>{
          if(err){
              reject(new Error(err))
          }else{
              resolve(data)
          }
      })
    })
  },
  updateSort(id,{input}){
    const data = {
      sortname: input.sortname,
      sortename: input.sortename,
      createTime: input.createTime,
      isshow: input.isshow
    }
    return new Promise((resolve,reject)=>{
      mysql.query('update sortInfo set ? where ?',[data,id],(err,data)=>{
          if(err){
             reject(new Error(err))
          }else{
           resolve(data)    
        }
      })
    })
  }
}

router.use('/',egraph({
    schema:schema,
    rootValue:root,
    graphiql: true
}))

module.exports = router