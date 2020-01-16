const express = require("express");
const mysql = require('../../util/db')
const img = require('../../util/img')
const router = express.Router();
const imgutil = new img();

// /**
//  * 广告接口 
//  */

app.use('/GETAD', (res, req, next) => {

    })
    // let schema = graphql.buildSchema(`
    //   type adInfo{
    //     id: ID!,
    //     adid:Int,
    //     adimg:String,
    //     createTime:String,
    //     startdue:String,
    //     overdue:String,
    //     priority:Int,
    //     shopid:String,
    //     clickcount:Int,
    //     create_man:String
    //   },
    //   input adinfo{
    //     adid:Int,
    //     adimg:String,
    //     createTime:String,
    //     startdue:String,
    //     overdue:String,
    //     priority:Int,
    //     shopid:String,
    //     clickcount:Int,
    //     create_man:String
    //   },
    //   type Query{
    //       adinfos(adid: Int):[adInfo]
    //   }
    //   type Mutation{
    //       insertAd(input:adinfo):adInfo
    //       updateAD(id:ID!,adid:Int,adimg:String,startdue:String,overdue:String,priority:Int,create_man:String):adInfo
    //       updateCount(id:ID!,clickcount:Int):adInfo
    //   }
    // `)
    // /**
    //  * 
    //  * @param {*} String Base64格式图片
    //  * return 存储路径 localhost:3000/ad/..
    //  * (命名规则)
    //  */
    // const saveImg = (string) => {
    //   return imgutil.saveImg("./public/ad/", string)
    // }

// var root = {
//   /**
//    * 通过广告位获取广告
//    */
//   adinfos({input}) {
//     return new Promise((resolve, reject) => {
//       console.log(input)
//       const data = {
//         adid: input
//       }
//       mysql.query("select * from adinfo where ?", data, (err, data) => {
//         if (err) {
//           reject(err)
//         }
//         resolve(data)
//       })
//     })
//   },
//   /**
//    * 添加广告
//    * @param {*} param0 
//    */
//   insertAd({
//     input
//   }) {
//     const data = {
//       adid: input.adid,
//       adimg: saveImg(input.adimg),
//       create_time: new Date(),
//       startdue: new Date(input.startdue),
//       overdue: new Date(input.overdue),
//       priority: input.priority,
//       shopid: input.shopid,
//       clickcount: 0,
//       create_man: input.create_man,
//     }
//     mysql.query("insert into adinfo set ?", data, (err, data) => {
//       if (err) {
//         console.log("发生错误" + err.message)
//         return JSON.stringify({
//           code: "410",
//           message: "失败"+err.message
//         })
//       }
//       return JSON.stringify({
//         code: "200",
//         message: "success"
//       })
//     })
//   },
//   /**
//    * 更新广告
//    * @param {*} param0 
//    */
//   updateAd({
//     id,
//     adid,
//     adimg,
//     startdue,
//     overdue,
//     priority,
//     create_man
//   }){
//     const data = [
//       adid,
//       saveImg(adimg),
//       new Date(startdue),
//       new Date(overdue),
//       priority,
//       create_man,
//       id
//     ]
//     mysql.query("update adinfo set adid= ?,adimg=?,startdue=?,overdue=?,priority=?,create_man=? where id=?",data,(err,data)=>{
//       if( err ){
//         console.log("发生错误" + err.message)
//         return JSON.stringify({
//           code: "410",
//           message: "失败"+err.message
//         })
//       }
//       return JSON.stringify({
//         code: "200",
//         message: "success"
//       })
//     })
//   },
//   /**
//    * 添加点击次数
//    * @param {*} param0 
//    */
//   updateCount({
//     id,
//     clickcount
//   }){
//     const data=[++clickcount,id]
//     mysql.query("update adinfo set clickcount=? where id=?",data,(err)=>{
//       if( err ){
//         console.log("发生错误" + err.message)
//         return JSON.stringify({
//           code: "410",
//           message: "失败"+err.message
//         })
//       }
//       return JSON.stringify({
//         code: "200",
//         message: "success"
//       })
//     })
//   }
// }
// router.post("/", (req, res, next) => {

// })

// module.exports = router;