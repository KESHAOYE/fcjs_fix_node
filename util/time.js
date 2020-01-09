// 获取时间 或 时间戳
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
        return Math.floor(new Date().getTime() / 1000)
    }
    // 获取N天后的时间戳
    getOtherTimeStamp(n) {
        n = parseInt(n)
        return Math.floor(new Date().getTime() / 1000) / 1000 + n * 60
    }
    // 获取当前时间 YYYY-MM-DD HH:MM:SS
    getTime() {
        var date = new Date();

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
    getCTime() {
        var year = date.getFullYear();
        var month = date.getMonth();
        var day = date.getDate();

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