const express = require('express')
const mysql = require('../../util/db')
// 加密
var utility = require("utility");
// 时间获取
const time = require('../../util/time')
// 图片处理
const img = require('../../util/img')
const imgs = new img()
const regs = require('../../util/reg')
const token = require('../../util/token')
let tokens = new token()
const reg = new regs()

let app = express()

async function existUser(phone) {
    let sql = `select count(1) as count from userinfo where phone = ${phone}`
    let query = await mysql(sql)
    if (query[0].count > 0) {
        return Promise.resolve(403)
    } else {
        return Promise.resolve(200)
    }
}
async function existId(id, phone) {
    let sql = `select count(1) as count from userinfo where user_id = ${id} and phone = ${phone}`
    let query = await mysql(sql)
    if (query[0].count > 0) {
        return Promise.resolve(200)
    } else {
        return Promise.resolve(403)
    }
}
// 注册
app.use('/REGISTERNEW', async (req, res, next) => {
    let {
        name,
        phone,
        validator,
        password
    } = req.body
    reg.checkusername(name, (data) => {
        if (data) {
            res.json({
                code: 600,
                message: data
            })
            return
        }
    })
    reg.checkphonenumber(phone, (data) => {
        if (data) {
            res.json({
                code: 600,
                message: data
            })
            return
        }
    })
    reg.checkpassword(password, (data) => {
        if (data) {
            res.json({
                code: 600,
                message: data
            })
            return
        }
    })
    let passwords = utility.md5(password)
    let regisiterTime = time.getTime()
    let userId = time.nowTimeStamp() + Math.floor(Math.random() * 10000 + 1)
    let code = await existUser(phone)
    if (code === 403) {
        res.json({
            code: 600,
            message: '已经存在相同的手机号,请直接前往登录'
        })
    } else {
        //插入语句
        let sql = `
        insert into userinfo(user_id,username,phone,password,regisitertime) values('${userId}','${name}','${phone}','${passwords}','${regisiterTime}');
        insert into roleuser(userid,roleid) values('${userId}', '${1}');
        `
        mysql(sql)
            .then(data => {
                res.json({
                    code: 200,
                    message: '注册成功',
                    userId: userId
                })
            })
            .catch(err => {
                res.json({
                    code: 600,
                    message: err
                })
            })
    }
})

// 资料补齐
app.use('/FULLINFO', async (req, res, next) => {
    let {
        userid,
        phone,
        id,
        name,
        birth,
        sex,
        headimg
    } = req.body
    reg.checkphonenumber(phone, data => {
        if (data) {
            res.json({
                code: 600,
                message: data
            })
            return
        }
    })
    reg.checkmanid(id, data => {
        if (data) {
            res.json({
                code: 600,
                message: data
            })
            return
        }
    })
    reg.checkname(name, data => {
        if (data) {
            res.json({
                code: 600,
                message: data
            })
            return
        }
    })
    let query = await existId(userid, phone)
    if (query === 403) {
        res.json({
            code: 600,
            message: '不存在该用户，无法修改信息'
        })
    } else {
        let head = ''
        if (headimg.indexOf('default') == -1) {
            let head = headimg != '' ? imgs.saveImg('/userHead/', headimg) : ''
            if (head == 'Error: 您上传的不是图片') {
                res.json({
                    code: 600,
                    message: '您上传的不是图片'
                })
            } else {
                let sexs = {
                    '男': 1,
                    '女': 2
                } [sex]
                let sql = `update userinfo set id = '${id}', birthday = '${time.getTime(birth)}', name = '${name}', sex = '${sexs}', isname = '1', nametime = '${time.getTime()}', headimg = '${head}' where user_id = ${userid}`
                mysql(sql).then(data => {
                        res.json({
                            code: 200,
                            message: '已完善'
                        })
                    })
                    .catch(err => {
                        res.json({
                            code: 600,
                            message: '发生错误'
                        })
                    })
            }
        }
    }
})

app.use('/CHANGEPASSWORD', (req, res, next) => {
    let {
        password,
        userid
    } = req.body
    let _t_ = req.headers.authorization
    let phone = req.headers.phone
    let t = tokens.checkToken(phone, _t_)
    reg.checkpassword(password, (data) => {
        if (data) {
            res.json({
                code: 600,
                message: data
            })
            return
        }
    })
    let passwords = utility.md5(password)
    t.then(data => {
            let sql = `update userinfo set password = '${passwords}' where user_id = '${userid}'`
            mysql(sql).then(data => {
                    res.json({
                        code: 200,
                        message: '已修改'
                    })
                })
                .catch(err => {
                    res.json({
                        code: 600,
                        message: '发生错误'
                    })
                })
        })
        .catch(err => {
            res.json({
                code: 601,
                message: '你没有权限'
            })
        })
})

module.exports = app