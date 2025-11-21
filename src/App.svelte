<!-- src/App.svelte -->
<script>
  // @ts-nocheck
  import Loading from "./components/loading.svelte";
  import { Router, Link, Route } from "svelte-navigator";
  import RouteTransitions from "./RouteTransitions.svelte";

  import Home from "./routes/Home.svelte";
</script>

<!-- primary={false} 禁用 svelte-navigator 默认的焦点管理，从而避免 “Could not find an element to focus” 的告警。 -->
<Router primary={false}>
  <nav class="site-nav" aria-label="站点导航">
    <div class="nav-links">
      <Link to="/">Me</Link>
      <Link to="/hobbies"> Hobbies </Link>
      <Link to="/gear"> Gear </Link>
      <Link to="/gallery"> Gallery </Link>
    </div>
  </nav>

  <main>
    <RouteTransitions>
      <Route path="/" component={Home} />

      <Route path="hobbies">
        {#await import("./routes/Hobbies.svelte")}
          <Loading />
        {:then module}
          <svelte:component this={module.default} />
        {:catch error}
          <div>加载失败: {error.message}</div>
        {/await}
      </Route>

      <Route path="gear">
        {#await import("./routes/Gear.svelte")}
          <Loading />
        {:then module}
          <svelte:component this={module.default} />
        {:catch error}
          <div>加载失败: {error.message}</div>
        {/await}
      </Route>

      <Route path="gallery">
        {#await import("./routes/Gallery.svelte")}
          <Loading />
        {:then module}
          <svelte:component this={module.default} />
        {:catch error}
          <div>加载失败: {error.message}</div>
        {/await}
      </Route>

      <Route path="*">
        <div class="section-card">
          <h2>页面未找到</h2>
          <p class="muted">链接可能已过期，请使用上方导航返回主页。</p>
        </div>
      </Route>
    </RouteTransitions>
  </main>
</Router>
