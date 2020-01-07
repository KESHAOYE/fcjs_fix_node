var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const http = require('http')
    //引入socket服务
const chat = require('./util/chat')
    //引入 token服务
const token = require('./util/token')
    //引入图片验证码库
const validator = require('./util/imgvalidator')

console.log("%c ****开发环境下要调用图片验证码接口系统需为Windows 且安装GraphicsMagick 如报错可重启电脑再试****","color:red;font-size:20px");
console.log(' ****Redis环境目前仅配置Windows ,端口为3005****');
chat();
var indexRouter = require('./routes/index');
var brandRouter = require('./routes/home/brand');
// var adapiRouter = require("./routes/ad/adapi");
var fixmodelRouter = require('./routes/home/fixmodel')
var sortRouter = require('./routes/home/sort')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
// app.use('/adapi',adapiRouter);
app.use('/brand', brandRouter);
app.use('/fixmodel', fixmodelRouter)
app.use('/sort', sortRouter)
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