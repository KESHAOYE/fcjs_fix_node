const express = require('express')
const imgValidator = require('../../util/imgvalidator')
let app = express()

let img = ''
app.post('/GET',(req, res, next)=>{
  let {width, height, phone} = req.body
  let img = new imgValidator(width, height)
  img.getData(phone).then(resdata =>{
    const data = {
        code: 200,
        success: 'ok',
        data: resdata
      }
      res.send(JSON.stringify(data))  
  })
})

app.post('/CHECK',(req, res, next)=>{
  let {x, phone} = req.body
  img.checkData(phone, data).
  then(data => {
      console.log(data)
  })
})

module.exports = app