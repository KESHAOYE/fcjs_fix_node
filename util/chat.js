const http = require('http')
const socketIo = require('socket.io')
const express = require('express')
const _ = require('underscore')
const app = express()
/**
 * socket服务
 */
// 寻找是否有客服在线
function chat() {
    var clients = []
    const ser = http.Server(app);
    const soc = socketIo(ser);
    console.log('socket服务启动');
    soc.on('connection', (socket) => {
        //监听connection（用户连接）事件，socket为用户连接的实例
        //监听用户名
        socket.on('storeClientInfo', (data) => {
            var clientInfo = new Object()
            clientInfo.customId = data.customId;
            clientInfo.type = data.type
            clientInfo.clientId = socket.id;
            clientInfo.isb = false
            clients.push(clientInfo);
                soc.emit('storeClientInfo', clients)
                console.log("用户" + clientInfo.customId + "连接");
                soc.emit('newconnect', clients[clients.length-1])
        })
        socket.on('findAdmin',()=>{
            var fa = []
            for(let i in clients){
                if(clients[i].type == 'ADMIN' && !clients[i].isb){
                    fa.push(clients[i])
                }
            }
            var index = Math.floor(Math.random()*fa.length)
            var toUser = _.findWhere(soc.sockets.sockets, {
                id: socket.id
              })
            if(fa.length > 0){
                let adminindex = clients.findIndex(el=>{
                    return el.clientId = fa[index].clientId
                })
                clients[adminindex].isb = true
                toUser.emit('finedAdmin',{
                  adminInfo: fa[index],
                  status: true,
                  message: '找到客服，等待连接'
                })
            }else{
                toUser.emit('finedAdmin',{
                    adminInfo: [],
                    status: false,
                    message: '无客服在线'
                })
            }
        })
        //监听用户断开事件
        socket.on('disconnect', () => {
            let user = clients.findIndex(function(el){
                return el.clientId == socket.id
            })
            if(user != -1){
             console.log(`用户${clients[user].customId}断开连接`);
             soc.emit('userDisconnect',{
                 info:clients[user]
             })
             clients.splice(user, 1)
            }
        });
        socket.on('sayto', (data) => {
            var toId = data.id.clientId;
            let toUser = _.findWhere(soc.sockets.sockets, {
                id: toId
            })
            let userName = clients.findIndex(el=>{
                return el.clientId == socket.id
            })
            toUser.emit('sayto', {
                user: clients[userName].customId,
                msg: data.msg
            })
        })
    })

    ser.listen(200);
}

module.exports = chat