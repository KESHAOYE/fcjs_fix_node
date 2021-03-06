var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fs = require('fs')
var FileStreamRotator = require('file-stream-rotator');
var bodyParser = require('body-parser');
var chat = require('./util/chat')
chat();


var indexRouter = require('./routes/index');
var brandRouter = require('./routes/home/brand');
var sortRouter = require('./routes/home/sort')

var app = express();
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var logDirectory = __dirname + '/logs';
//确保日志文件目录存在 没有则创建
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

//创建一个写路由
var accessLogStream = FileStreamRotator.getStream({
    filename: logDirectory + '/accss-%DATE%.log',
    frequency: 'daily',
    verbose: false
})

logger.format('fcjs', `[福城建设-接口监控平台]:方法:method  路径:url  状态:status`)
app.use(logger('fcjs', { stream: accessLogStream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/brand', brandRouter);
app.use('/sort', sortRouter)
let login = require('./routes/user/login')
app.use('/login', login)
let imgValidator = require('./routes/user/imgValidator')
app.use('/imgValidator', imgValidator)
let register = require('./routes/user/register')
app.use('/register', register)
let ad = require('./routes/ad/adapi')
app.use('/ad', ad)
let phoneValidator = require('./routes/user/phoneValidator')
app.use('/phoneValidator', phoneValidator)
let adminlogin = require('./routes/admin/adminlogin')
app.use('/adminlogin', adminlogin)
let spec = require('./routes/shop/spec')
app.use('/spec', spec)
let shop = require('./routes/shop/shop')
app.use('/shop', shop)
let stock = require('./routes/shop/stock')
app.use('/stock',stock)
let fixitem = require('./routes/fix/fixitem')
app.use('/fixitem',fixitem)
let fixitemsort = require('./routes/fix/fixitemsort')
app.use('/fixitemsort',fixitemsort)
let fixmodel = require('./routes/fix/fixmodel')
app.use('/fixmodel',fixmodel)
let coupon = require('./routes/home/coupon')
app.use('/coupon',coupon)
let search = require('./routes/shop/search')
app.use('/search',search)
let comment = require('./routes/comment/comment')
app.use('/comment',comment)
let shopcar = require('./routes/order/shopcar')
app.use('/shopcar',shopcar)
let address = require('./routes/user/address')
app.use('/address',address)
let order = require('./routes/order/order')
app.use('/order',order)
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