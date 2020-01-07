const redis = require('redis')

let client = redis.createClient('6379', '127.0.0.1')
client.on('connect', function (err) {
    if(err){
    console.log(err)
    } else {
    console.log("redis 连接成功");
    }
})
client.on('error', function(err){
    console.log(`redis出现错误:${err}`);
})

module.exports = client