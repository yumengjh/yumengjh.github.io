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
        // 建议在某个生命周期移除事件监听器（这个匿名箭头函数在每次 new Router() 时都会重新创建，但你没在销毁前 removeEventListener，这会导致多个 refresh() 被绑定。）
        if (this.mode === RouterMode.HASH) {
            window.addEventListener('hashchange', () => this.refresh());
            // window.addEventListener('load', () => this.refresh());
        } else {
            window.addEventListener('popstate', () => this.refresh());
            // window.addEventListener('load', () => this.refresh());
        }

        // 初始化自定义元素
        this.initCustomElements();
    }

    initCustomElements() {
        // 注册RouterLink组件
        // DOM 被销毁时可以自动解除绑定，避免内存泄漏
        if (!customElements.get('router-link')) {
            customElements.define('router-link', class extends HTMLElement {
                constructor() {
                    super();
                    this._onClick = null;   // 预留事件处理器引用
                }

                connectedCallback() {
                    const to = this.getAttribute('to');
                    const router = document.querySelector('router-view')?._router;
                    // 创建链接元素
                    const link = document.createElement('a');
                    link.href = (router && router.mode === RouterMode.HISTORY) ? to : '#' + to;

                    // 定义并保存点击处理函数
                    this._onClick = (e) => {
                        e.preventDefault();
                        router?.push(to);
                    };
                    link.addEventListener('click', this._onClick);

                    link.innerHTML = this.innerHTML;
                    this.innerHTML = '';
                    this.appendChild(link);
                }
                disconnectedCallback() {
                    // 清理事件监听器
                    const link = this.querySelector('a');
                    if (link && this._onClick) {
                        console.log('清理事件监听器');
                        link.removeEventListener('click', this._onClick);
                    }
                    this._onClick = null;
                }
            });
        }

        // 注册RouterView组件
        if (!customElements.get('router-view')) {
            customElements.define('router-view', class extends HTMLElement {
                constructor() {
                    super();
                    this._router = null;    // 路由实例
                    this._currentComponent = null;  // 当前组件
                }

                // 组件被插入到 DOM 中时触发
                connectedCallback() {
                    // 初始化时尝试从外部 router 实例绑定
                    if (!this._router) {
                        // 可以从 window 里挂一个全局 router 引用，或父组件传递
                        this._router = window.__appRouter__;
                        // console.log('window.__appRouter__:', window.__appRouter__);
                        // console.log('router:', this._router);
                    }

                    if (this._router) {
                        this._router._view = this; // 让 router 可以调用 view 渲染
                        this.render(); // 初始渲染
                    }
                }

                // 组件从 DOM 中移除时触发
                disconnectedCallback() {
                    this.clear(); // 卸载旧视图，避免残留
                }

                // 渲染组件 
                render() {
                    if (!this._router) return;

                    const route = this._router.getMatchedRoute();
                    if (!route || !route.component) return;

                    // 清除旧视图
                    this.clear();

                    const component = route.component;
                    if (typeof component === 'function') {
                        this._currentComponent = component(); // 返回 HTMLElement 或字符串
                    } else {
                        this._currentComponent = component;
                    }

                    if (typeof this._currentComponent === 'string') {
                        this.innerHTML = this._currentComponent;
                    } else if (this._currentComponent instanceof HTMLElement) {
                        this.appendChild(this._currentComponent);
                    }
                }

                // 清除组件
                clear() {
                    this.innerHTML = '';
                    this._currentComponent = null;
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
            /*
            TODO: 此处考虑给页面组件添加 destroy() 钩子，在加载新页面前执行清理。
            */
            return doc.body.innerHTML;
        } catch (error) {
            console.error('加载页面失败:', error);
            return await this.loadHTML('./view/404.html');
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

    // 解析路由参数
    parseParams(routePath, currentPath) {
        const routeParts = routePath.split('/');    // 路由路径
        const currentParts = currentPath.split('/'); // 当前路径
        // console.log('解析路由参数----routeParts:', routeParts, 'currentParts:', currentParts);
        const params = {};

        if (routeParts.length !== currentParts.length) {
            return null;
        }

        for (let i = 0; i < routeParts.length; i++) {
            if (routeParts[i].startsWith(':')) {
                // 提取参数名，例如 :id -> id
                const paramName = routeParts[i].slice(1);
                params[paramName] = currentParts[i];
            } else if (routeParts[i] !== currentParts[i]) {
                return null;
            }
        }

        return params;
    }

    // 检查路由是否匹配
    matchRoute(routePath, currentPath) {
        // console.log('检查路由是否匹配----路由路径:', routePath, '当前路径:', currentPath);
        const params = this.parseParams(routePath, currentPath);
        if (params !== null) {
            this.params = params;  // 存储解析出的参数
            return true;
        }
        return routePath === currentPath;
    }

    async refresh() {
        this.currentPath = this.getPath();
        const routerView = document.querySelector('router-view');

        if (!routerView) {
            console.error('未找到 router-view 元素');
            return;
        }

        // 存储router实例到routerView元素
        routerView._router = this;

        // 查找匹配的路由
        const matchedRoute = this.routes.find(route => this.matchRoute(route.path, this.currentPath));
        // console.log('matchedRoute:', matchedRoute);
        if (matchedRoute) {
            try {
                // 如果component是函数，则调用它并传入路由参数
                const componentPath = typeof matchedRoute.component === 'function'
                    ? matchedRoute.component(this.params)
                    : matchedRoute.component;

                const content = await this.loadHTML(componentPath);
                // 方案一
                // routerView.innerHTML = content;

                // 方案二
                /*
                replaceChildren() 方法接受一个或多个 DOM 节点或字符串，并将其替换为当前元素的子元素。
                它比直接设置 innerHTML 更高效，因为它避免了解析 HTML 字符串的过程。
                createContextualFragment() 方法接受一个 HTML 字符串，并将其转换为 DocumentFragment。
                createRange() 方法返回一个 Range 对象，用于在 DOM 中选择和操作文本范围。
                */

                // 方案三
                // routerView.innerHTML = '' 再赋值，避免事件残留

                routerView.replaceChildren(document.createRange().createContextualFragment(content));
            } catch (error) {
                routerView.innerHTML = 'Error loading page content';
            }
        } else {
            routerView.replaceChildren(document.createRange().createContextualFragment(await this.loadHTML('./view/404.html')));
        }
    }

    async navigate(path, method = 'push') {
        if (typeof path !== 'string' || !path) {
            console.warn(`[Router.navigate] 无效的路径: ${path}`);
            return;
        }

        if (this.mode === RouterMode.HASH) {
            const hashPath = path.startsWith('#') ? path : '#' + path;
            if (method === 'replace') {
                const href = window.location.href;
                const i = href.indexOf('#');
                window.location.replace(href.slice(0, i >= 0 ? i : href.length) + hashPath);
            } else {
                window.location.hash = path;
            }
        } else {
            if (method === 'replace') {
                window.history.replaceState(null, '', path);
            } else {
                window.history.pushState(null, '', path);
            }
            await this.refresh();
        }
    }

    async push(path) {
        await this.navigate(path, 'push');
    }

    async replace(path) {
        await this.navigate(path, 'replace');
    }

    go(n) {
        // if (typeof n !== 'number' || !Number.isInteger(n)) {
        //     console.warn(`[Router.go] 参数必须是整数，收到: ${n}`);
        //     return;
        // }
        window.history.go(n);
    }

    // 获取当前路由参数
    getParams() {
        return this.params;
    }
}

// 创建路由实例
const router = new Router({
    mode: RouterMode.HASH,
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
        // 动态路由配置
        {
            path: '/post/:id',
            component: (params) => {
                // console.log('动态路由参数:', params);
                return `./post/${params.id}.html`;
            }
        }
    ]
});
// window.__appRouter__ = router;
// 导出路由实例供其他模块使用
export default router;
