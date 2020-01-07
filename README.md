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