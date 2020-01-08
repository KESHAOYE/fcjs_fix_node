const express = require('express')
const imgValidator = require('../../util/imgvalidator')
let app = express()

let img = ''
app.post('/GET', (req, res, next) => {
    let { width, height, phone } = req.body
    new imgValidator(width, height).getData(phone).then(resdata => {
        const data = {
            code: 200,
            success: 'ok',
            data: resdata
        }
        res.send(JSON.stringify(data))
    })
})

app.post('/CHECK', (req, res, next) => {
    let { x, phone } = req.body
    new imgValidator(0, 0).checkData(phone, x)
        .then(data => {
            var result = {}
            if (data === 'ok') {
                result = {
                    code: 200,
                    status: true
                }
            }
            res.send(JSON.stringify(result))
        })
        .catch(err => {
            let result = {
                code: 2001,
                status: false,
                message: err
            }
            res.send(JSON.stringify(result))
        })
})

module.exports = app