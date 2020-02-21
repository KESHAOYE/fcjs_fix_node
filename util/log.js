var fs = require('fs')
var time = require('../util/time')
var readline = require('readline') 

exports.log=function(req,res,next){
    let filename = `/accss-${time.getdate()}.log`
    var fRead = fs.createReadStream('./logs'+filename);
    var objReadline = readline.createInterface({
        input:fRead
    });
    var arr = new Array();
    objReadline.on('line',function (line) {
        arr.push(line);
    });
    objReadline.on('close',function () {
      next();
      // res.render('index', { title: '福城建设NodeJs接口平台' , tip: '服务已启动，欢迎使用', data: arr});
    });
}