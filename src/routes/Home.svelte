<script>
  import { messages } from '../i18n/store';
</script>

<svelte:head>
  <title>Yumengjh</title>
</svelte:head>

<section class="hero-card">
  <p class="tagline">{$messages?.home?.tagline}</p>

  <h1>{$messages?.home?.title}</h1>

  <p class="lead">
    {$messages?.home?.intro}
  </p>

  <p class="lead">
    {$messages?.home?.focus}
  </p>

  <p class="lead">
    {$messages?.home?.philosophy}
  </p>

  <p class="lead">
    {$messages?.home?.blog}
    <a href="https://blog.yumg.top" target="_blank" rel="noreferrer">{$messages?.home?.blogUrl}</a>  
    {$messages?.home?.blogDesc}
  </p>
</section>

<style>
  .hero-card a {
    color: var(--text-muted);
    text-decoration: none;
    font-weight: 500;
    letter-spacing: 0.02em;
  }
</style>
