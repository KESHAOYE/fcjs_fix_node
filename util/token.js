const nodersa = require('node-rsa')
    // 导入Redis库
const client = require('./redis')

class token {
    /**
     * 生成新Token
     */
    constructor() {
        this.key = new nodersa({ b: 512 })
    }

    newToken(phone) {
        // 获取时间戳
        let timestamp = Math.round(new Date().getTime() / 1000)
        const data = `${phone}${timestamp}`
        let token = this.key.encrypt(data, 'base64')
        client.hmset(`T${phone}`, {
            token: token,
            // token时长为60分钟
            time: timestamp + 60 * 60
        })
        return token
    }
    async checkToken(phone, token) {
        let ttime = ''
        let ttoken = ''
        let reg = new RegExp(/'/g)
        token = token.replace(reg, '')
        await new Promise(function(resolve, reject) {
            client.hget(`T${phone}`, 'token', function(err, data) {
                if (!err) {
                    resolve(data)
                } else {
                    reject(err)
                }
            })
        }).then(data => ttoken = data)
        await new Promise(function(resolve, reject) {
            client.hget(`T${phone}`, 'time', function(err, data) {
                if (!err) {
                    resolve(data)
                } else {
                    reject(err)
                }
            })
        }).then(data => ttime = data)
        return new Promise(async (resolve,reject)=>{
        if (ttime - Math.round(new Date().getTime() / 1000) > 0) {
            //时间验证通过 验证token
            if (token == ttoken) {
                let timestamp = Math.round(new Date().getTime() / 1000)
                client.hmset(`T${phone}`, {
                    token: token,
                    // token时长为60分钟
                    time: timestamp + 60 * 60
                })
                resolve()
            } else {
                return reject('Token Error')
            }
        } else {
            return reject('Token TimeOut')
        }
    })
    }
    async checkAdminToken(phone,token,roleid){
        return new Promise((resolve,reject)=>{
          this.checkToken(phone,token).then(
              data=>{ 
                if(roleid >= 1){
                    return resolve(data)
                }else{
                    return reject('您没有管理员权限')
                }
              }
          )
          .catch(err=>{
              return reject(err)
          })
        })
    }
}
module.exports = token