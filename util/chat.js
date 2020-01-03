const http = require('http')
const socketIo = require('socket.io')
const express = require('express')
const _ = require('underscore')
const app = express()
/**
 * socket服务
 */
function chat() {
    const ser = http.Server(app);
    const soc = socketIo(ser);
    console.log('socket服务启动');
    var clients = []
    soc.on('connection', (socket) => {
        //监听connection（用户连接）事件，socket为用户连接的实例
        //监听用户名
        socket.on('storeClientInfo', (data) => {
            var clientInfo = new Object();
            clientInfo.customId = data.customId;
            clientInfo.clientId = socket.id;
            clients.push(clientInfo);
            soc.emit('storeClientInfo', clients)
            socket.emit('newconnect', clients)
            console.log("用户" + clientInfo.customId + "连接");
        })
        //监听用户断开事件
        socket.on('disconnect', () => {
            console.log("用户断开连接");
        });
        socket.on('sayto', (data) => {
            var toId = data.id;
            let toUser = _.findWhere(soc.sockets.sockets, {
                id: toId
            })
            let userName = clients.find(function (el) {
                return el.clientId === socket.id
            })
            toUser.emit('sayto', {
                user: userName.customId,
                msg: data.msg
            })
        })
    })

    ser.listen(200);
}

module.exports = chat