/**
 * 时间方法，用于获取时间或时间戳
 * Author: KESHAOYE
 * Date: 2020-1-8
 */
class Time {
    // 时间戳转 YYYY-MM-DD HH:MM:SS
    timeStampToTime() {

    }
    // 时间戳转 YYYY年MM月DD日 HH时MM分SS秒
    // 返回秒
    timeStampToCTime() {

    }
    // 获取现在时间戳
    nowTimeStamp() {
        process.env.TZ = 'Asia/Shanghai';
        return Math.floor(new Date().getTime() / 1000)
    }
    // 获取N天后的时间戳
    getOtherTimeStamp(n) {
        process.env.TZ = 'Asia/Shanghai';
        n = parseInt(n)
        return Math.floor(new Date().getTime() / 1000) / 1000 + n * 60
    }
    getdate(date){
        date = date == undefined ? new Date :new Date(date);
        var year = date.getFullYear();
        var month = date.getMonth();
        var day = date.getDate();
        if (month < 10) {
            month =  parseInt(month)+parseInt(1);
            month = '0' + month
        }
        if (day < 10) {
            day = '0' + day;
        }
        return `${year}-${month}-${day}`
    }
    // 获取当前时间 YYYY-MM-DD HH:MM:SS
    getTime(date) {
        process.env.TZ = 'Asia/Shanghai';
        date = date == undefined ? new Date :new Date(date);

        var year = date.getFullYear();
        var month = date.getMonth();
        var day = date.getDate();

        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();

        //这样写显示时间在1~9会挤占空间；所以要在1~9的数字前补零;
        if (hour < 10) {
            hour = '0' + hour;
        }
        if (minute < 10) {
            minute = '0' + minute;
        }
        if (second < 10) {
            second = '0' + second;
        }
        return `${year}-${month+1}-${day} ${hour}:${minute}:${second}`
    }
    // 获取当前时间 YYYY年MM月DD日 HH时MM分SS秒
    getCTime(date) {
        process.env.TZ = 'Asia/Shanghai';
        date = date == undefined ? new Date :new Date(date);
        var year = date.getFullYear();
        var month = date.getMonth();
        var day = date.getDate()+1;

        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();

        if (hour < 10) {
            hour = '0' + hour;
        }
        if (minute < 10) {
            minute = '0' + minute;
        }
        if (second < 10) {
            second = '0' + second;
        }
        return `${year}年${month+1}月${day}日 ${hour}时${minute}分${second}秒`
    }
}

module.exports = new Time()