<!-- src/App.svelte -->
<script>
  // @ts-nocheck
  import Loading from "./components/loading.svelte";
  import LanguageSwitcher from "./components/LanguageSwitcher.svelte";
  import { Router, Link, Route } from "svelte-navigator";
  import RouteTransitions from "./RouteTransitions.svelte";
  import { language, messages, i18nLoading } from "./i18n/store";

  import Home from "./routes/Home.svelte";

  $: t = $messages;
</script>

<!-- primary={false} 禁用 svelte-navigator 默认的焦点管理，从而避免 "Could not找到一个元素来聚焦" 的告警。 -->
<Router primary={false}>
  <nav class="site-nav" aria-label="site-navigation">
    <div class="nav-links">
      <Link to="/">{t?.nav?.me || 'Me'}</Link>
      <Link to="/stack">{t?.nav?.stack || 'Stack'}</Link>
      <Link to="/hobbies">{t?.nav?.hobbies || 'Hobbies'}</Link>
      <Link to="/gear">{t?.nav?.gear || 'Gear'}</Link>
      <Link to="/gallery">{t?.nav?.gallery || 'Gallery'}</Link>
    </div>
    <div class="nav-actions">
      <LanguageSwitcher />
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
          <div>{t?.loading?.error || 'Loading failed:'} {error.message}</div>
        {/await}
      </Route>
      <Route path="stack">
        {#await import("./routes/stack.svelte")}
          <Loading />
        {:then module}
          <svelte:component this={module.default} />
        {:catch error}
          <div>{t?.loading?.error || 'Loading failed:'} {error.message}</div>
        {/await}
      </Route>
      <Route path="gear">
        {#await import("./routes/Gear.svelte")}
          <Loading />
        {:then module}
          <svelte:component this={module.default} />
        {:catch error}
          <div>{t?.loading?.error || 'Loading failed:'} {error.message}</div>
        {/await}
      </Route>

      <Route path="gallery">
        {#await import("./routes/Gallery.svelte")}
          <Loading />
        {:then module}
          <svelte:component this={module.default} />
        {:catch error}
          <div>{t?.loading?.error || 'Loading failed:'} {error.message}</div>
        {/await}
      </Route>

      <Route path="*">
        <section class="hero-card hero-minimal">
          <p class="tagline">{t?.notFound?.tagline || '404 Not Found'}</p>
          <h1>{t?.notFound?.title || '404 Not Found'}</h1>
          <p class="lead">
             {t?.notFound?.message || 'The page you are looking for does not exist.'}
          </p>
        </section>
      </Route>
    </RouteTransitions>
  </main>
</Router>

<style>

</style>
