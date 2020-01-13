const redis = require('redis')

let client = redis.createClient('6379', '127.0.0.1')
client.on('connect', function (err) {
    if(err){
    console.log(err)
    } else {
    console.log("redis 连接中..");
    }
})
client.on('reconnecting',function() {
    console.log("redis重连中")
})
client.on('ready', ()=> {
    console.log("redis连接成功")
})
client.on('end', ()=>{
    console.log("redis断开连接")
})
client.on('error', (err) => {
    if(err.toString().indexOf('ECONNREFUSED')!=-1){
        err = "连接失败"
    }
    console.log(`redis错误:${err}`);
})

module.exports = client