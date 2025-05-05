// 路由模式枚举
const RouterMode = {
    HASH: 'hash',
    HISTORY: 'history'
};

class Router {
    constructor(options) {
        this.routes = options.routes || [];
        this.mode = options.mode || RouterMode.HASH;
        this.base = options.base || '/';    // 基础路径（未使用）
        this.currentPath = '';
        this.init();
        this.initProgressBar();
    }

    init() {
        // 初始化时执行一次路由解析
        this.refresh();
        // 为什么需要执行两次refresh？
        // 1. 第一次refresh是为了获取当前路径
        // 2. 第二次refresh是为了获取当前路径对应的组件
        // 根据模式绑定不同的事件
        if (this.mode === RouterMode.HASH) {
            window.addEventListener('hashchange', () => this.refresh());
            window.addEventListener('load', () => this.refresh());
        } else {
            window.addEventListener('popstate', () => this.refresh());
            window.addEventListener('load', () => this.refresh());
        }

        // 初始化自定义元素
        this.initCustomElements();
    }

    initCustomElements() {
        // 注册RouterLink组件
        if (!customElements.get('router-link')) {
            customElements.define('router-link', class extends HTMLElement {
                constructor() {
                    super();
                }

                connectedCallback() {
                    const to = this.getAttribute('to');
                    const router = document.querySelector('router-view')?._router;
                    // 创建链接元素
                    const link = document.createElement('a');
                    
                    // 根据路由模式设置链接
                    if (router && router.mode === RouterMode.HISTORY) {
                        link.href = to;
                    } else {
                        link.href = '#' + to;
                    }
                    
                    // 添加点击事件处理
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        if (router) {
                            router.push(to);
                        }
                    });

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
                    this._router = null;    // 存储router实例 ？？？
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

    // 规范化组件路径
    normalizePath(path) {
        // 移除开头的 ./ 
        path = path.replace(/^\.\//, '');
        
        // 如果不是以 / 开头，添加 /
        if (!path.startsWith('/')) {
            path = '/' + path;
        }
        
        return path;
    }

    async loadHTML(url) {
        // 规范化URL路径
        const normalizedUrl = this.normalizePath(url);
        // console.log('从以下位置加载 HTML：', normalizedUrl);
        
        this.showProgressBar();
        try {
            const response = await fetch(normalizedUrl);
            if (!response.ok) {
                console.error('HTTP 错误:', response.status);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
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

    getPath() {
        let path;
        if (this.mode === RouterMode.HASH) {
            path = window.location.hash.slice(1) || '/';
        } else {
            path = window.location.pathname || '/';
        }
        // console.log('当前路径：', path);
        return path;
    }

    async refresh() {
        this.currentPath = this.getPath();
        const routerView = document.querySelector('router-view');
        
        if (!routerView) {
            console.error('未找到 router-view 元素');
            return;
        }

        // 存储router实例到routerView元素
        routerView._router = this;  // 把Router实例存储到routerView元素上
        const matchedRoute = this.routes.find(route => route.path === this.currentPath);

        if (matchedRoute) {
            try {
                const content = await this.loadHTML(matchedRoute.component);
                routerView.innerHTML = content;
            } catch (error) {
                routerView.innerHTML = 'Error loading page content';
            }
        } else {
            routerView.innerHTML = '404 Page not found <br> <a href="/">Back to home</a>';
        }
    }

    async push(path) {
        console.log('[Push]导航到：', path);
        if (this.mode === RouterMode.HASH) {
            window.location.hash = path;
        } else {
            window.history.pushState(null, '', path);
            await this.refresh();
        }
    }

    async replace(path) {
        console.log('[Replace]导航到：', path);
        if (this.mode === RouterMode.HASH) {
            const href = window.location.href;
            const i = href.indexOf('#');
            window.location.replace(href.slice(0, i >= 0 ? i : href.length) + '#' + path);
        } else {
            window.history.replaceState(null, '', path);
            await this.refresh();
        }
    }

    go(n) {
        window.history.go(n);
    }
}

// 创建路由实例
const router = new Router({
    mode: RouterMode.HISTORY,  // 使用枚举值
    base: '/',
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
