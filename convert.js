const fs = require('fs').promises;
const path = require('path');
const marked = require('marked');

async function convertMarkdownToHtml() {
    const postsDir = './posts';
    const outputDir = './post';

    try {
        // 确保输出目录存在
        await fs.mkdir(outputDir, { recursive: true });

        // 读取所有markdown文件
        const files = await fs.readdir(postsDir);
        const mdFiles = files.filter(file => file.endsWith('.md'));

        for (const file of mdFiles) {
            const filePath = path.join(postsDir, file);
            const markdown = await fs.readFile(filePath, 'utf-8');
            
            // 转换为HTML
            const html = marked.parse(markdown);
            
            // 生成完整的HTML文档
            const fullHtml = `
<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${file.replace('.md', '')}</title>
    <style>
        :root {
            --primary-color: #007bff;
            --secondary-color: #6c757d;
            --background-color: #f8f9fa;
            --text-color: #212529;
        }
        .post-content {
            max-width: 700px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
        }
        .post-content img {
            max-width: 100%;
            height: auto;
        }
        .post-content code {
            background-color: #f8f9fa;
            padding: 2px 4px;
            border-radius: 4px;
        }
        .post-content pre code {
            display: block;
            padding: 1em;
            overflow-x: auto;
        }
    </style>
</head>
<body>
    <div class="post-content">
        ${html}
    </div>
</body>
</html>`;

            // 保存HTML文件
            const outputFile = path.join(outputDir, file.replace('.md', '.html'));
            await fs.writeFile(outputFile, fullHtml);
            console.log(`已转换: ${file} -> ${path.basename(outputFile)}`);
        }

        console.log('所有文件转换完成！');
    } catch (error) {
        console.error('转换过程中出错:', error);
    }
}

// 执行转换
convertMarkdownToHtml();