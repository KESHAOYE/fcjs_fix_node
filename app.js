var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fs = require('fs')
var FileStreamRotator = require('file-stream-rotator');
const time = require('./util/time')

const http = require('http')
    //引入socket服务
const chat = require('./util/chat')
    //引入 token服务
const token = require('./util/token')
    //引入图片验证码库
const validator = require('./util/imgvalidator')

// new validator(250,150).getData('15359639480')
// new validator(250,150).checkData('15359639480')
// chat();
var indexRouter = require('./routes/index');
var brandRouter = require('./routes/home/brand');
// var adapiRouter = require("./routes/ad/adapi");
var fixmodelRouter = require('./routes/home/fixmodel')
var sortRouter = require('./routes/home/sort')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var logDirectory=__dirname+'/logs';
//确保日志文件目录存在 没有则创建
fs.existsSync(logDirectory)||fs.mkdirSync(logDirectory);

//创建一个写路由
var accessLogStream=FileStreamRotator.getStream({
filename:logDirectory+'/accss-%DATE%.log',
frequency:'daily',
verbose:false
})

logger.format('fcjs',`[福城建设-接口监控平台]:方法:method  路径:url  状态:status`)
app.use(logger('fcjs',{stream:accessLogStream}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
// app.use('/adapi',adapiRouter);
app.use('/brand', brandRouter);
app.use('/fixmodel', fixmodelRouter)
app.use('/sort', sortRouter)
let login = require('./routes/user/login')
app.use('/login', login)
let imgValidator = require('./routes/user/imgValidator')
app.use('/imgValidator', imgValidator)
let register = require('./routes/user/register')
app.use('/register', register)
let order = require('./routes/user/order')
app.use('/order', order)
    // catch 404 and forward to error handler
    //捕捉404并抛出错误处理器
app.use(function(req, res, next) {
    next(createError(404));
});

//错误处理器
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
module.exports = app;