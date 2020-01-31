/**
 * 用于连接数据库
 */

const mysql = require("mysql")

let pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'LKW54321likewei.',
    database: 'fcjs_fix',
    multipleStatements: true
})
pool.getConnection((err)=>{
  if(err) {
      console.log(`数据库未连接！请连接数据库后刷新`)
  } else {
      console.log(`数据库连接成功`);
  }
})
let query = function(sql, values) {
    // 返回一个 Promise
    console.log(sql)
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection) {
            if (err) {
                reject(err)
            } else {
                connection.query(sql, values, (err, rows) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(rows)
                    }
                    // 结束会话
                    connection.release()
                })
            }
        })
    })
}

module.exports = query