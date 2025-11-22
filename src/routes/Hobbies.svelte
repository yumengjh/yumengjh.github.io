<script>
  import { messages } from '../i18n/store';
  $: t = $messages;
</script>

<svelte:head>
  <title>{t?.hobbies?.title || 'My Hobbies'}</title>
</svelte:head>

<section class="hero-card hero-minimal">
  <p class="tagline">{t?.hobbies?.tagline || 'My Hobbies'}</p>
  <h1>{t?.hobbies?.title || 'My Hobbies'}</h1>
  <p class="lead">
     {t?.hobbies?.description || '💻 🎥 🎮 🎵 🎨'}
  </p>
</section>
