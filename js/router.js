class Router {
    constructor(options) {
        this.routes = options.routes || [];
        this.currentHash = '';
        this.init();
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

    async loadHTML(url) {
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
        }
    ]
});

// 导出路由实例供其他模块使用
export default router;
