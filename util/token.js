const http = require('http')
const express = require('express')
const nodersa = require('node-rsa')
const app = express()

class token {
  /**
   * 生成新Token
   */
  constructor(){
    this.key = new nodersa({b:512})
  }

  newToken (username, pwd) {
   // 获取时间戳
   let timestamp = new Date().getTime()
   const data = `u:${username}p:${pwd}t:${timestamp}`
   let token = this.key.encrypt(data,'base64')
   console.log(token)
  }
}

module.exports = token