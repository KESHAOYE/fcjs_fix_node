/**
 * 路由
 */
const app = require('express')()

let imgValidator = require('./routes/user/imgValidator')
app.use('/imgValidator', imgValidator)

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

module.exports = app