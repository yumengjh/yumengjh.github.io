const express = require('express');
const path = require('path');
const app = express();

// 设置正确的MIME类型
app.use((req, res, next) => {
    if (req.url.endsWith('.js')) {
        res.type('application/javascript');
    }
    next();
});

// 静态文件服务中间件
app.use(express.static(path.join(__dirname), {
    // 添加正确的MIME类型
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
        if (filePath.endsWith('.html')) {
            res.setHeader('Content-Type', 'text/html');
        }
    }
}));

// API 路由（如果有的话）放在这里
// app.get('/api/...', ...)

// 处理所有其他请求，返回index.html
// 注意：这个中间件必须放在静态文件中间件之后
app.get('*', (req, res) => {
    // 如果是静态资源请求，不处理
    if (req.url.match(/\.(js|css|html|png|jpg|jpeg|gif|ico)$/)) {
        return next();
    }
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
}); 