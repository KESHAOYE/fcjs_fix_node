// 导入图片插入库
const images = require('gm');
//导入文件操作哭
const fs = require('fs');

class imgValidator {
  /**
   * 初始化图片大小
   * @param {*} width 宽度
   * @param {*} height 长度
   */
  constructor (width, height) {
    this.width = width 
    this.height = height
    this.valwidth = 50
    this.valheight = 50
    this.x = 0
    this.y = 0
  }
  /**
   * 生成随机整数坐标
   */
  randomXY () {
    this.x = Math.floor(Math.random()*(this.width - this.valwidth)+1)
    this.y = Math.floor(Math.random()*(this.height - this.valheight)+1)
  }
  /**
   * 修改图片大小为请求的大小
   */
  zipImg () {
    images('./public/ad/1.jpg').resize(this.width, this.height, '!')
  }
  /**
   * 生成抠图的图片
   */
  createMainImg () {
    this.randomXY()
    images('./public/ad/1.jpg')
    .crop(this.valwidth,this.valheight,this.x,this.y)
    .write('./public/ad/2.jpg',function (err) {
        if(!err) {
            console.log('done')
        } else {
            console.log(err);
        }
    })
  }
}

module.exports = imgValidator