const nodersa = require('node-rsa')
// 导入Redis库
const client = require('./redis')

class token {
  /**
   * 生成新Token
   */
  constructor(){
    this.key = new nodersa({b:512})
  }

  newToken (phone, pwd) {
   // 获取时间戳
   let timestamp = Math.round(new Date().getTime()/1000)
   const data = `${phone}${pwd}${timestamp}`
   let token = this.key.encrypt(data,'base64')
   client.hmset(`T${phone}`,{
     token: token,
     time: timestamp + 60 * 60
   })
   return token
  }
  async checkToken (phone, token) {
    let ttime = ''
    let ttoken = ''
    await new Promise(function(resolve, reject){
      client.hget(`T${phone}`,'token',function(err, data){
        if(!err){
          resolve(data)
        } else {
          reject(err)
        }
      })
    }).then(data=> ttoken = data)
    await new Promise(function(resolve, reject){
      client.hget(`T${phone}`,'time',function(err, data){
        if(!err){
          resolve(data)
        } else {
          reject(err)
        }
      })
    }).then(data=> ttime = data)
    if(ttime - Math.round(new Date().getTime()/1000) > 0){
      //时间验证通过 验证token
      if(token === ttoken){
        return Promise.resolve('ok')
      } else {
        return Promise.reject('Token Error')
      }
    } else {
      return Promise.reject('Token TimeOut')
    }
  }
}
module.exports = token