// 导入图片插入库
const images = require('gm');
//导入文件操作哭
const fs = require('fs');
// 导入图片操作库
const img = require('./img')
const imgutil = new img()
    // 导入Redis库
const client = require('./redis')
const redis = require('redis')

class imgValidator {
    /**
     * 初始化图片大小
     * @param {*} width 宽度
     * @param {*} height 长度
     */
    constructor(width, height) {
            this.width = width
            this.height = height
            this.valwidth = this.width / 6
            this.valheight = this.valwidth
            this.validatorImg = ''
            this.x = 0
            this.y = 0
        }
        /**
         * 生成随机整数坐标
         */
    randomXY() {
            this.x = Math.floor(Math.random() * ((this.width - this.valwidth) - this.valwidth) + this.valwidth)
            this.y = Math.floor(Math.random() * (this.height - this.valheight) + this.height)
        }
        /**
         * 随机读取图片
         */
    readImg() {
            let random = Math.floor(Math.random() * 4 + 1)
            this.validatorImg = `./public/validator/${random}.jpg`
        }
        /**
         * 修改图片大小为请求的大小
         */
    zipImg() {
            return images(this.validatorImg).resize(this.width, this.height, '!')
        }
        /**
         * 生成主图
         */
    async createMainImg() {
            let that = this
            let filename = imgutil.checkexist('validator', '.jpg')
            return new Promise(function(resolve, reject) {
                that.zipImg()
                    .fill('#f2f2f2')
                    .drawRectangle(that.x, that.y, that.x + that.valwidth, that.y + that.valheight)
                    .write('./public/validator/' + filename, function(err) {
                        if (!err) {
                            resolve(imgutil.imgtobase('./public/validator/' + filename))
                            fs.unlinkSync('./public/validator/' + filename)
                        } else {
                            reject(err)
                        }
                    })
            })
        }
        /**
         * 生成抠图的图片
         */
    async createPairImg() {
        let that = this
        let filename = imgutil.checkexist('validator', '.jpg')
        return new Promise(function(resolve, reject) {
            that.zipImg()
                .crop(that.valwidth, that.valheight, that.x, that.y)
                .write('./public/validator/' + filename, function(err) {
                    if (!err) {
                        resolve(imgutil.imgtobase('./public/validator/' + filename))
                        fs.unlinkSync('./public/validator/' + filename)
                    } else {
                        reject(err)
                    }
                })
        })
    }
    async getData(phone) {
        this.randomXY()
        this.readImg()
        let bg = await this.createMainImg()
        let patch = await this.createPairImg()
        let time = Math.round(new Date().getTime() / 1000) + 60 * 3
            // 存入redis
        client.hmset(`V${phone}`, {
            x: this.x,
            time: time
        })
        console.log(this.x)
        return {
            bg: bg,
            patch: patch,
            y: this.y,
            valwidth: this.valwidth
        }
    }
    async checkData(phone, data) {
        let time = 0
        let x = 0
            // 异步获取时间
        await new Promise(function(resolve, reject) {
                client.hget(`V${phone}`, 'time', function(err, value) {
                    if (!err) {
                        resolve(value)
                    } else {
                        reject(err)
                    }
                })
            }).then(data => { time = data })
            // 异步获取坐标
        await new Promise(function(resolve, reject) {
            client.hget(`V${phone}`, 'x', function(err, value) {
                if (!err) {
                    resolve(value)
                } else {
                    reject(err)
                }
            })
        }).then(data => {
            x = data
        })
        return new Promise(function(resolve, reject) {
            if (Math.round(time - new Date().getTime() / 1000) >= 0) {
                // 时间通过 验证 X
                console.log(data, x, time)
                x = parseInt(x)
                console.log(x - 15, x + 15)
                console.log(data > x - 15 || data < x + 15)
                if (data > x - 15 && data < x + 15) {
                    // x 通过
                    resolve('ok')
                    console.log('ok');
                } else {
                    reject('验证出错')
                    console.log('验证出错');
                }
            } else {
                reject('验证超时')
                console.log('验证超时');
            }
        })
    }
}

module.exports = imgValidator