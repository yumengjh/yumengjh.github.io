<script>
  // @ts-nocheck

  import { Route } from "svelte-navigator";
  import Loading from "./components/Loading.svelte";
  import { messages } from "./i18n/store";

  export let path;
  export let loader;

  $: t = $messages;
</script>

<!-- 注意这里必须 primary={false} 防止焦点警告 -->
<Route path={path} primary={false}>
  {#await loader()}
    <Loading />
  {:then module}
    <svelte:component this={module.default} />
  {:catch error}
    <div class="error">
      {t?.loading?.error || "Loading failed:"} {error.message}
    </div>
  {/await}
</Route>
