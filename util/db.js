/**
 * 用于连接数据库
 */

 const mysql=require("mysql")

 var pool = mysql.createPool({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "LKW54321likewei.",
    database: "fcjs_fix"
 })

 module.exports=pool