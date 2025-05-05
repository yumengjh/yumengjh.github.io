const express = require('express');
const path = require('path');
const app = express();

// 静态文件服务
app.use(express.static('./'));

// 所有路由都返回index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 设置正确的MIME类型
app.use((req, res, next) => {
    if (req.url.endsWith('.js')) {
        res.type('application/javascript');
    }
    next();
});

// 启动服务器
const port = 3000;
app.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`);
}); 