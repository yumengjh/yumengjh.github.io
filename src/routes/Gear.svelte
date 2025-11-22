<script>
  import { messages } from '../i18n/store';
  $: t = $messages;
</script>

<svelte:head>
  <title>{t?.gear?.title || 'My Gear'}</title>
</svelte:head>

<section class="hero-card hero-minimal">
  <p class="tagline">{t?.gear?.tagline || 'My Gear'}</p>
  <h1>{t?.gear?.title || 'My Gear'}</h1>
  <p class="lead">
    {t?.gear?.description || '💻 📱 💾 📷 🎥'}
  </p>
</section>

<style>
 
</style>
