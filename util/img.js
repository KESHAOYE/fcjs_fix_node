const fs = require('fs')
const express = require('express')
const type = require('mime-types')
const app = express()

class img {
    /**
     * 判断是否是图片
     */
    isImg(string) {
        let reg = new RegExp(/^data:image\/\w+;base64,/);
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
    imgtobase(path) {
            let bitmap = fs.readFileSync(path)
            let base64str = Buffer.from(bitmap, 'binary').toString('base64'); // base64编码
            base64str = "data:" + type.lookup(path) + ";base64," + base64str
            return base64str;
        }
        /**
         * 生成文件名 并 查询是否重名
         * @param{*} filename 文件名
         */
    checkexist(path, type) {
        let types = type == null ? '.png' : type
        var time = new Date()
        var filename = time.getFullYear().toString() + (time.getMonth() + 1).toString() + (time.getDay() + 1).toString() + time.getHours().toString() + time.getMinutes().toString() + time.getSeconds().toString() + time.getMilliseconds().toString() + (Math.ceil(Math.random() * 100)).toString()
        if (fs.existsSync("./public/" + path + filename)) {
            let reg = new RegExp(/\(\d\)/)
            if (reg.test(filename)) {
                let a = reg.match(filename)
                return new Error("发生错误")
            }
        } else {
            return filename + types
        }
    }

    /**
     * 将图片保存到路径中
     */
    saveImg(path, string) {
        let el = this.checkexist(path)
        if (this.isImg(string)) {
            fs.writeFile(path + el, this.basetoimg(string), (err) => {
                if (err) {
                    return new Error(err)
                }
            })
            return path + el
        } else {
            return new Error("您上传的不是图片")
        }
    }
}

module.exports = img