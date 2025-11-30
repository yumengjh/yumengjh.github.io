<script>
  // 禁用 TS 检查避免组件推断错误
  // @ts-nocheck

  import { Router, Link, Route } from "svelte-navigator";
  import RouteTransitions from "./RouteTransitions.svelte";

  import LanguageSwitcher from "./components/LanguageSwitcher.svelte";

  // 直接加载的首页
  import Home from "./routes/Home.svelte";
  import LazyRoute from "./LazyRoute.svelte";

  import { messages } from "./i18n/store";
  $: t = $messages;
</script>

<!-- Router 必须设置 primary={false} 避免默认焦点管理报错 -->
<Router primary={false}>

  <!-- 导航栏 -->
  <nav class="site-nav" aria-label="site-navigation">
    <div class="nav-links">
      <Link to="/">{t?.nav?.me || "Me"}</Link>
      <Link to="/stack">{t?.nav?.stack || "Stack"}</Link>
      <Link to="/hobbies">{t?.nav?.hobbies || "Hobbies"}</Link>
      <Link to="/gear">{t?.nav?.gear || "Gear"}</Link>
      <Link to="/gallery">{t?.nav?.gallery || "Gallery"}</Link>
    </div>
    <div class="nav-actions">
      <LanguageSwitcher />
    </div>
  </nav>

  <!-- 页面主体 -->
  <main>
    <RouteTransitions>

      <!-- 同步页面（不需要懒加载） -->
      <Route path="/" component={Home} />

      <!-- 懒加载页面（自动处理 Loading / Error） -->
      <LazyRoute path="stack" loader={() => import("./routes/stack.svelte")} />
      <LazyRoute path="hobbies" loader={() => import("./routes/Hobbies.svelte")} />
      <LazyRoute path="gear" loader={() => import("./routes/Gear.svelte")} />
      <LazyRoute path="gallery" loader={() => import("./routes/Gallery.svelte")} />

      <!-- 404 -->
      <Route path="*">
        <section class="hero-card hero-minimal">
          <p class="tagline">{t?.notFound?.tagline || "404 Not Found"}</p>
          <h1>{t?.notFound?.title || "404 Not Found"}</h1>
          <p class="lead">
            {t?.notFound?.message || "The page you are looking for does not exist."}
          </p>
        </section>
      </Route>

    </RouteTransitions>
  </main>
</Router>
