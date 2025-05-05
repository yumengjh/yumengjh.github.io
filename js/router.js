class Router {
    constructor(options) {
        this.routes = options.routes || [];
        this.currentHash = '';
        this.init();
        this.initProgressBar();
    }

    init() {
        // 初始化时执行一次路由解析
        this.refresh();
        // 监听hash变化
        window.addEventListener('hashchange', () => this.refresh());

        // 初始化自定义元素
        this.initCustomElements();
    }

    initCustomElements() {
        // 注册RouterLink组件
        if (!customElements.get('router-link')) {
            customElements.define('router-link', class extends HTMLElement {
                constructor() {
                    super();
                    const to = this.getAttribute('to');
                    const link = document.createElement('a');
                    link.href = '#' + to;
                    link.innerHTML = this.innerHTML;
                    this.innerHTML = '';
                    this.appendChild(link);
                }
            });
        }

        // 注册RouterView组件
        if (!customElements.get('router-view')) {
            customElements.define('router-view', class extends HTMLElement {
                constructor() {
                    super();
                }
            });
        }
    }

    initProgressBar() {
        if (!document.getElementById('router-progress')) {
            const bar = document.createElement('div');
            bar.id = 'router-progress';
            bar.style.cssText = `
                position: fixed;
                top: 0; left: 0; right: 0;
                height: 2px;
                background: linear-gradient(90deg, #4a90e2 0%, #42b983 100%);
                width: 0;
                z-index: 9999;
                transition: width 0.3s;
            `;
            document.body.appendChild(bar);
        }
    }

    showProgressBar() {
        const bar = document.getElementById('router-progress');
        if (bar) {
            bar.style.width = '80%';
            bar.style.opacity = '1';
        }
    }

    hideProgressBar() {
        const bar = document.getElementById('router-progress');
        if (bar) {
            bar.style.width = '100%';
            setTimeout(() => {
                bar.style.opacity = '0';
                bar.style.width = '0';
            }, 300);
        }
    }

    async loadHTML(url) {
        this.showProgressBar();
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const html = await response.text();
            // 提取body内容
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            return doc.body.innerHTML;
        } catch (error) {
            console.error('加载页面失败:', error);
            return '404 Page not found <br> <a href="/">Back to home</a>';
        } finally {
            this.hideProgressBar();
        }
    }

    async refresh() {
        this.currentHash = location.hash.slice(1) || '/';
        const routerView = document.querySelector('router-view');
        const matchedRoute = this.routes.find(route => route.path === this.currentHash);

        if (matchedRoute) {
            const content = await this.loadHTML(matchedRoute.component);
            routerView.innerHTML = content;
        } else {
            routerView.innerHTML = '404 Page not found <br> <a href="/">Back to home</a>';
        }
    }

    push(path) {
        window.location.hash = path;
    }
}

// 创建路由实例
const router = new Router({
    routes: [
        {
            path: '/',
            component: './view/home.html'
        },
        {
            path: '/tag',
            component: './view/tag.html'
        },
        {
            path: '/post',
            component: './view/post.html'
        },
        {
            path: '/about',
            component: './view/about.html'
        },
        // 文章配置
        {
            path: '/post/01',
            component: './post/js-small-note.html'
        }
    ]
});

// 导出路由实例供其他模块使用
export default router;
