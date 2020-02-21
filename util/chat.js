const http = require('http')
const socketIo = require('socket.io')
const express = require('express')
const _ = require('underscore')
const app = express()
const mysql = require('.//db')
const img = require('./img')
const imgutil = new img()

/**
 * socket服务
 */
// 寻找是否有客服在线
function chat() {
    var clients = []
    var roomInfo = {}
    const ser = http.Server(app);
    const soc = socketIo(ser);
    console.log('socket服务启动');
    soc.on('connection', (socket) => {
        //监听connection（用户连接）事件，socket为用户连接的实例
        //监听用户名
        socket.on('storeClientInfo', (data) => {
            var clientInfo = new Object()
            let sql = `select * from userinfo where user_id = ${data.userid}`
            mysql(sql)
                .then(a => {
                    a = JSON.parse(JSON.stringify(data))
                    a.path = a.path == null ? 'http://localhost:3000/userHead/default.png' : imgutil.imgtobase(`./public${a.path}`)
                    clientInfo.customId = data.customId;
                    clientInfo.type = data.type
                    clientInfo.clientId = socket.id;
                    clientInfo.userId = data.userid
                    clientInfo.userHead = a.path
                    clientInfo.isb = false
                    clients.push(clientInfo);
                    soc.emit('storeClientInfo', clients)
                    console.log("用户" + clientInfo.customId + "连接");
                    soc.emit('newconnect', clients[clients.length - 1])
                })
        })
        socket.on('findAdmin', () => {
            var fa = []
            for (let i in clients) {
                if (clients[i].type == 'ADMIN' && !clients[i].isb) {
                    fa.push(clients[i])
                }
            }
            var index = Math.floor(Math.random() * fa.length)
            var toUser = _.findWhere(soc.sockets.sockets, {
                id: socket.id
            })
            if (fa.length > 0) {
                console.log('触发连接客服');
                let adminindex = clients.findIndex(el => {
                    return el.clientId = fa[index].clientId
                })
                clients[adminindex].isb = true
                toUser.emit('finedAdmin', {
                    adminInfo: fa[index],
                    status: true,
                    message: '找到客服，等待连接'
                })
                let adminUser = _.findWhere(soc.sockets.sockets, {
                    id: fa[index].clientId
                })
                if (adminUser) {
                    setTimeout(() => {
                        let userindex = clients.findIndex(el => {
                            return el.clientId == socket.id
                        })
                        adminUser.emit('findUser', {
                            userinfo: clients[userindex],
                            status: true,
                            info: '找到客户，开始聊天'
                        })
                    }, 1000)
                }
            } else {
                toUser.emit('finedAdmin', {
                    adminInfo: [],
                    status: false,
                    message: '无客服在线'
                })
            }
        })
        //监听用户断开事件
        socket.on('disconnect', () => {
            let user = clients.findIndex(function (el) {
                return el.clientId == socket.id
            })
            if (user != -1) {
                console.log(`用户${clients[user].customId}断开连接${clients[user].type}`);
                soc.emit('userDisconnect', {
                    info: clients[user]
                })
                clients.splice(user, 1)
            }
        });
        socket.on('sendorder',data=>{
            var toId = data.data.clientId;
            let toUser = _.findWhere(soc.sockets.sockets, {
                id: toId
            })
            let userName = clients.findIndex(el => {
                return el.clientId == socket.id
            })
            if (toUser) {
                console.log('触发订单');
                toUser.emit('getorder', {
                    user: clients[userName].customId,
                    type: data.type,
                    msg: '',
                    img:'',
                    order:data.order
                })
            }
        })
        socket.on('sayto', (data) => {
            var toId = data.data.clientId;
            let toUser = _.findWhere(soc.sockets.sockets, {
                id: toId
            })
            let userName = clients.findIndex(el => {
                return el.clientId == socket.id
            })
            if (toUser) {
                console.log('触发发送语句内容');
                toUser.emit('sayto', {
                    user: clients[userName].customId,
                    type: data.type,
                    msg: data.msg,
                    img:data.img,
                    order:''
                })
            }
        })
    })

    ser.listen(200);
}

module.exports = chat