/**
 * 用于正则验证
 */

class reg {
    /**
     * 验证身份证
     * @param {*} rules 
     * @param {*} value 判断值
     * @param {*} callback 回调函数
     */
     checkmanid(value, callback) {
        if (value.length <= 0) {
            callback("身份证号不能为空");
            return false;
        }
        let reg = new RegExp(/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/);
        if (reg.test(value)) {
            callback();
            return true;
        } else {
            callback("身份证格式错误!")
            return false;
        }
    }
     checkname(value, callback) {
            if (value === "") {
                callback("姓名不能为空")
                return false
            }
            let reg = new RegExp(/^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/)
            if (reg.test(value)) {
                callback()
                return true
            } else {
                callback("姓名输入不合法,要求为汉字,长度大于1且小于20")
                return false
            }
        }
        /**
         * 检测银行卡
         * @param {*} rule 
         * @param {*} value 
         * @param {*} callback 
         */
     checkbankid(value, callback) {
        var lastNum = value.substr(value.length - 1, 1); //取出最后一位（与luhm进行比较）

        var first15Num = value.substr(0, value.length - 1); //前15或18位
        var newArr = new Array();
        for (var i = first15Num.length - 1; i > -1; i--) { //前15或18位倒序存进数组
            newArr.push(first15Num.substr(i, 1));
        }
        var arrJiShu = new Array(); //奇数位*2的积 <9
        var arrJiShu2 = new Array(); //奇数位*2的积 >9

        var arrOuShu = new Array(); //偶数位数组
        for (var j = 0; j < newArr.length; j++) {
            if ((j + 1) % 2 == 1) { //奇数位
                if (parseInt(newArr[j]) * 2 < 9)
                    arrJiShu.push(parseInt(newArr[j]) * 2);
                else
                    arrJiShu2.push(parseInt(newArr[j]) * 2);
            } else //偶数位
                arrOuShu.push(newArr[j]);
        }

        var jishu_child1 = new Array(); //奇数位*2 >9 的分割之后的数组个位数
        var jishu_child2 = new Array(); //奇数位*2 >9 的分割之后的数组十位数
        for (var h = 0; h < arrJiShu2.length; h++) {
            jishu_child1.push(parseInt(arrJiShu2[h]) % 10);
            jishu_child2.push(parseInt(arrJiShu2[h]) / 10);
        }

        var sumJiShu = 0; //奇数位*2 < 9 的数组之和
        var sumOuShu = 0; //偶数位数组之和
        var sumJiShuChild1 = 0; //奇数位*2 >9 的分割之后的数组个位数之和
        var sumJiShuChild2 = 0; //奇数位*2 >9 的分割之后的数组十位数之和
        var sumTotal = 0;
        for (var m = 0; m < arrJiShu.length; m++) {
            sumJiShu = sumJiShu + parseInt(arrJiShu[m]);
        }

        for (var n = 0; n < arrOuShu.length; n++) {
            sumOuShu = sumOuShu + parseInt(arrOuShu[n]);
        }

        for (var p = 0; p < jishu_child1.length; p++) {
            sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p]);
            sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p]);
        }
        //计算总和
        sumTotal = parseInt(sumJiShu) + parseInt(sumOuShu) + parseInt(sumJiShuChild1) + parseInt(sumJiShuChild2);

        //计算Luhm值
        var k = parseInt(sumTotal) % 10 == 0 ? 10 : parseInt(sumTotal) % 10;
        var luhm = 10 - k;

        if (lastNum == luhm) {
            callback();
            return true;
        } else {
            callback("银行卡格式错误!");
            return false;
        }
    }
     checkphonenumber(value, callback) {
        if (value.length <= 0) {
            callback("手机号不能为空!")
            return false
        }
        let reg = new RegExp(/^1[3456789]\d{9}$/)
        if (reg.test(value)) {
            callback();
            return true
        } else {
            callback("手机号码格式错误!")
            return false
        }
    }
     checkpassword(value, callback) {
        if (value.length == 0) {
            callback("密码不能为空!");
            return false;
        }
        if (value.length < 6 || value.length > 20) {
            callback("密码长度必须在6-20位之间");
            return false;
        }
        let reg = new RegExp(/^[a-zA-z0-9_!@]{6,20}$/)
        if (!reg.test(value)) {
            callback("密码中只能包含数字字母下划线,@,！")
            return false;
        } else {
            callback()
            return true;
        }
    }
     checkspassword(value, callback) {
        if (value.length <= 0) {
            callback("确认密码不能为空")
        }
        if (value2.length <= 0) {
            callback('请先输入新密码')
        } else if (value != value2) {
            callback('两次密码不一致')
        } else {
            callback();
        }
    }
     checkusername(value, callback) {
        if (value.length == 0) {
            callback('昵称不能为空')
            return false
        } else if (value.length > 10) {
            callback('昵称不能超过10个字')
            return false
        } else {
            callback()
            return true
        }
    }
     checkreg(value, callback) {
        if (value.length == 0) {
            callback("验证码不能为空!")
            return false;
        }
        if (value.length > 4) {
            callback("验证码不能大于4")
            return false;
        }
        let reg = new RegExp(/^[a-zA-Z0-9]{3,4}$/)
        if (reg.test(value)) {
            callback();
            return true;
        } else {
            callback("验证码只能包含字母数字,且长度为3位或4位");
            return false;
        }
    }
}

module.exports = reg