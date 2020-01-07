// 导入图片插入库
const images = require('gm');
//导入文件操作哭
const fs = require('fs');
const img = require('./img')
const imgutil = new img()

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
            this.x = Math.floor(Math.random() * (this.width - this.valwidth) + 1)
            this.y = Math.floor(Math.random() * (this.height - this.valheight) + 1)
        }
        /**
         * 随机读取图片
         */
    readImg() {
        let random = Math.floor(Math.random()*4 + 1)
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
                    .fill('#fff')
                    .drawRectangle(that.x, that.y, that.x + that.valwidth, that.y + that.valheight)
                    .write('./public/validator/' + filename, function(err) {
                        if (!err) {
                            resolve(imgutil.imgtobase('./public/validator/' + filename))
                            // fs.unlinkSync('./public/validator/' + filename)
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
                        // fs.unlinkSync('./public/validator/' + filename)
                    } else {
                        reject(err)
                    }
                })
        })
    }
    async getData() {
        this.randomXY()
        this.readImg()
        let bg = await this.createMainImg()
        let patch = await this.createPairImg()
        return {
            bg: bg,
            patch: patch,
            x: this.x,
            y: this.y
        }
    }
}

module.exports = imgValidator