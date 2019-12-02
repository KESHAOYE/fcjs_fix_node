const fs = require('fs')
const express = require('express')
const app = express()

class img {
    /**
     * 判断是否是图片
     */
    isImg(string) {
        let reg=new RegExp(/^data:image\/\w+;base64,/);
        return reg.test(string);
    }

    /**
     * 将base64格式转为图片
     * @param {*} string
     */
    basetoimg(string) {
        var base64Data = string.replace(/^data:image\/\w+;base64,/, "");
        var dataBuffer = new Buffer(base64Data, 'base64');
        return dataBuffer
    }

    /**
     * 查询是否重名
     * @param{*} filename 文件名
     */
    checkexist(path,filename) {
        if (fs.existsSync("./public/"+path+filename)) {
            let reg=new RegExp(/\(\d\)/)
            console.log("object");
            if(reg.test(filename)){
              let a=reg.match(filename)
              console.log();
            }
        }else{
            return filename+".png"
        }
    }

    /**
     * 将广告图片保存到路径中
     */
    saveImg(path, string) {
        var time = new Date()
        if(this.isImg(string)) {
        //var filename = time.getFullYear().toString() + (time.getMonth() + 1).toString() + (time.getDay() + 1).toString() + time.getHours().toString() + time.getMinutes().toString() + time.getSeconds().toString()
        var filename=1
        fs.writeFile(path + filename, this.basetoimg(string), (err) => {
            if (err) {
                return new Error(err)
            }
        })
        this.checkexist(path,filename)
        return path + filename
         }else{
             return new Error("您上传的不是一张图片")
         }
    }
}

module.exports = img