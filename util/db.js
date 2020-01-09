/**
 * 用于连接数据库
 */

const mysql = require("mysql")

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'LKW54321likewei.',
    database: 'fcjs_fix'
});
module.exports = {
    query: (sql, params, callback) => {
        
        connection.query(sql, params, function (err, data, fields) {
            callback && callback(err, data, fields)
        })
    },
    end: ()=>{
        connection.end(function (err) {
            if (err) {
                console.log('关闭数据库连接失败！');
                throw err;
            }
        })
    }
}