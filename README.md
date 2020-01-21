## 注意事项
 * 关于图片接口
    >如要调用图片验证码接口，需在windows环境下安装 graphicsMagick,macOs下暂不支持调用图片验证码接口
    > Mac 环境尚未支持
 * Redis
    >默认端口为 6379
    >运行命令：Windows: redis-server.exe redis.windows.conf / redis-cli.exe -h 127.0.0.1 -p 6379
    >         Mac: 尚未配置
 * Redis 规则
    >(1)V + userid : 验证坐标
    >(2)T + userid : 用户Token
 * 本周安排 （1.20 - 1.27）
    > 重点
    [] 完成接入手机验证码
    [x] 完成广告接口开发 3h
    >开始商品各类接口开发
    [x] 分类 1h
    [x] 商品 
    [] 商品 -- 春节重点
    >开始用户中心接口开发
    [] 暂未安排
    >开始完成授权中心中间件开发
    [x] 客户域 5h
    [] 管理员域
    >
    [] **开始各功能接入数据中心的准备
    >开始管理员操作统计接口
    [] 管理员操作记录