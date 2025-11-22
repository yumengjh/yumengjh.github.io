<script>
  import { messages } from '../i18n/store';

  /** @type {{title: string; location: string; url: string} | null} */
  let activeImage = null;

  const images = [
    {
      title: "新加坡港口清晨",
      location: "Singapore",
      url: "https://img.yumeng.icu/2025/10/01/68dc8a295d2f3.jpeg"
    },
    {
      title: "东京街头霓虹",
      location: "Tokyo",
      url: "https://images.unsplash.com/photo-1505159940484-eb2b9f2588e2?auto=format&fit=crop&w=900&q=80"
    },
    {
      title: "京都清水寺",
      location: "Kyoto",
      url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80"
    },
    {
      title: "旧金山日落",
      location: "San Francisco",
      url: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80"
    }
  ];
</script>

<svelte:head>
  <title>{$messages?.gallery?.title || 'My Gallery'}</title>
</svelte:head>

<section class="hero-card hero-minimal">
  <p class="tagline">{$messages?.gallery?.tagline || 'My Gallery'}</p>
  <h1>{$messages?.gallery?.title || 'Snapshots & Moments'}</h1>
  <p class="lead">
    {$messages?.gallery?.description || '🌍 🌆 🌇 🌃 🌄'}
  </p>
</section>

<style>
  .hero-minimal {
    padding: 1.5rem 0 0;
  }
</style>
