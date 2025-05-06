/**
 * 平滑上移过渡效果工具类
 */
class SlideUp {
  constructor() {
    this.uniqueId = 0;
    this.slideElements = new Map();
    this.initialCheckTimer = null;
    this.forcedCheckCount = 0;
    this.MAX_FORCED_CHECKS = 5;
    
    // 绑定事件处理方法
    this.checkAllElements = this.checkAllElements.bind(this);
    this.setupInitialChecks = this.setupInitialChecks.bind(this);
  }

  // 为元素分配唯一ID
  getUniqueId() {
    return `slide-el-${this.uniqueId++}`;
  }

  // 判断元素是否在视口中
  isElementInViewport(el, threshold = 0.2) {
    if (!el) return false;
    
    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    
    const visibleRatio = 1 - Math.max(0, (rect.bottom < 0 ? 1 : rect.top > windowHeight ? 1 : 
                          (rect.top < 0 ? 0 : rect.top / windowHeight)));
    
    return visibleRatio > threshold;
  }

  // 应用动画样式
  applyAnimation(el, options) {
    if (!el.isConnected) return;
    if (el.dataset.slideComplete === 'true') return;
    
    const { delay, duration, distance } = options;
    
    el.style.opacity = '0';
    el.style.transform = `translateY(${distance})`;
    el.style.transition = `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`;
    el.style.transitionDelay = `${delay}ms`;
    
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (el.isConnected) {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          el.dataset.slideComplete = 'true';
        }
      });
    });
  }

  // 强制应用动画
  forceAllAnimations() {
    this.slideElements.forEach((data, id) => {
      const { el, options } = data;
      if (el.dataset.slideComplete === 'true' && options.once) return;
      this.applyAnimation(el, options);
      if (options.once) {
        this.slideElements.delete(id);
      }
    });
  }

  // 检查所有元素
  checkAllElements() {
    this.slideElements.forEach((data, id) => {
      const { el, options } = data;
      if (el.dataset.slideComplete === 'true' && options.once) return;
      
      if (this.isElementInViewport(el, options.threshold)) {
        this.applyAnimation(el, options);
        el.dataset.slideComplete = 'true';
        
        if (options.once) {
          this.slideElements.delete(id);
        }
      }
    });
  }

  // 初始化检查
  setupInitialChecks() {
    if (this.initialCheckTimer) {
      clearInterval(this.initialCheckTimer);
    }
    
    this.forcedCheckCount = 0;
    this.checkAllElements();
    
    this.initialCheckTimer = setInterval(() => {
      this.checkAllElements();
      this.forcedCheckCount++;
      
      if (this.forcedCheckCount >= this.MAX_FORCED_CHECKS) {
        this.forceAllAnimations();
        clearInterval(this.initialCheckTimer);
        this.initialCheckTimer = null;
      }
    }, 300);
  }

  // 添加元素
  add(el, options = {}) {
    const defaultOptions = {
      delay: 0,
      duration: 800,
      distance: '30px',
      once: true,
      threshold: 0.2
    };
    
    const finalOptions = { ...defaultOptions, ...options };
    const id = this.getUniqueId();
    el.dataset.slideId = id;
    
    // 初始样式
    el.style.opacity = '0';
    el.style.transform = `translateY(${finalOptions.distance})`;
    
    // 存储元素
    this.slideElements.set(id, { el, options: finalOptions });
    
    // 检查是否需要立即应用动画
    if (this.isElementInViewport(el, finalOptions.threshold)) {
      this.applyAnimation(el, finalOptions);
    }
    
    return id;
  }

  // 移除元素
  remove(id) {
    if (this.slideElements.has(id)) {
      this.slideElements.delete(id);
    }
  }

  // 初始化
  init() {
    // 页面加载完成后的检查
    window.addEventListener('DOMContentLoaded', this.setupInitialChecks);
    
    // 页面完全加载后的检查
    window.addEventListener('load', () => {
      setTimeout(() => {
        this.checkAllElements();
        setTimeout(() => this.forceAllAnimations(), 2000);
      }, 100);
    });
    
    // 监听滚动事件
    window.addEventListener('scroll', this.checkAllElements, { passive: true });
    
    // 监听DOM变化
    const observer = new MutationObserver((mutations) => {
      if (mutations.some(mutation => mutation.addedNodes.length > 0)) {
        setTimeout(() => this.checkAllElements(), 50);
      }
    });
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        observer.observe(document.body, { childList: true, subtree: true });
      });
    } else {
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }
}

// 导出单例实例
export const slideUp = new SlideUp();
export default slideUp; 