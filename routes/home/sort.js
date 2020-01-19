const express = require("express");
const mysql = require('../../util/db')
const app = express();
const token = require('../../util/token')

// 获取分类
app.use('/GETSORT', (req, res, next) => {
    let { count } = req.body | '15'
    let sql = `select * from sortinfo left join shopinfo on sortinfo.sortid = shopinfo.shopsort`
    let result = []
    mysql(sql)
        .then(data => {
            data.forEach(el => {
                let a = {
                    sortid: el.sortid,
                    sortname: el.sortname,
                    sortename: el.sortename,
                    isshow: el.isshow,
                    data: []
                }
            })
            res.json({
                code: 200,
                status: true,
            })
        })
        .catch(err => {
            res.json({
                code: 600,
                message: err
            })
        })
})

var schema = graphql.buildSchema(`
 type sort{
   sortid: ID!,
   sortname: String,
   sortename: String,
   createTime: String,
   isshow: Int
 }
 type Query{
   getSort:[sort]
 }
 input inputsort{
   sortid: ID!,
   sortname: String,
   sortename: String,
   createTime: String,
   isshow: Int
 }
type Mutation{
   insertSort(input: inputsort) :sort
   updateSort(id:ID!,input: inputsort) :sort
}
`)

var root = {
    getsort() {
        return new Promise((resolve, reject) => {
            mysql.query('select * from shopinfo where sorid = (select * from sortInfo)', (err, data) => {
                if (err) {
                    reject(new Error(err))
                } else {
                    resolve(data)
                }
            })
        })
    },
    insertSort({ input }) {
        const data = {
            sortname: input.sortname,
            sortename: input.sortename,
            createTime: new Date(),
            isshow: input.isshow
        }
        return new Promise((resolve, reject) => {
            mysql.query('insert into sortInfo set ?', data, (err, data) => {
                if (err) {
                    reject(new Error(err))
                } else {
                    resolve(data)
                }
            })
        })
    },
    updateSort(id, { input }) {
        const data = {
            sortname: input.sortname,
            sortename: input.sortename,
            createTime: input.createTime,
            isshow: input.isshow
        }
        return new Promise((resolve, reject) => {
            mysql.query('update sortInfo set ? where ?', [data, id], (err, data) => {
                if (err) {
                    reject(new Error(err))
                } else {
                    resolve(data)
                }
            })
        })
    }
}

router.post('/', (req, res, next) => {
    console.log(req.query)
})

module.exports = app