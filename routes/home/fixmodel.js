// const express = require("express");
// const mysql = require('../../util/db')
// const router = express();

// var schema = graphql.buildSchema(`
//   type fixmodel{
//       brandid: ID!,
//       modelid: ID!,
//       modelname: String,
//       modelename: String,
//       isdelete: Int
//   }
//   type Query{
//       fixmodel(brandid: ID!):[fixmodel]
//   }
//   input inputfixmodel{
//     brandid: ID!,
//     modelid: ID!,
//     modelname: String,
//     modelename: String,
//     isdelete: Int
//    }
//    type Mutation{
//     insertFixModel(input:inputfixmodel): fixmodel
//     updateFixModel(input:inputfixmodel): fixmodel
//    }
// `)

// var root = {
//     fixmodel({input}) {
//       const data = {
//         brandid:input
//       }
//       return new Promise((resolve, reject)=>{
//           mysql.query(`select * from fixmodel where ?`, data,(err, data) => {
//               if (err) {
//                 reject(err)
//               }else{
//                 resolve(data)
//               }
//           })
//       })
//     },
//     insertFixModel({input}) {
//       const data = {
//           brandid: input.brandid,
//           modelid: input.modelid,
//           modelname: input.modelname,
//           modelename: input.modelename,
//           isdelete: input.isdelete
//       }
//       return new Promise((resolve,reject) => {
//           mysql.query(`insert into fixmodel set ？`, data, (err,data) => {
//               if(err){
//                 reject(err)
//               } else {
//                 resolve(data)
//               }
//           })
//       })
//     },
//     updateFixModel ({input}) {
//       const data = {
//         modelid: input.modelid,
//         modelname: input.modelname,
//         modelename: input.modelename,
//         isdelete: input.isdelete
//       }
//       return new Promise((resolve,reject) => {
//          mysql.query(`update fixmodel set ？ where ？`,[data, input.brandid],(err,data) => {
//              if (err) {
//                reject(err)
//              } else {
//                resolve(data)
//              } 
//          })
//       })
//     }
// }
// router.post('/',egraph({
//     schema:schema,
//     rootValue:root,
//     graphiql:true
// }))

// module.exports = router