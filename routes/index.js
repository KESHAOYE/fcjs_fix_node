var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '福城建设NodeJs接口平台' , tip: '服务已启动，欢迎使用'});
});

module.exports = router;
