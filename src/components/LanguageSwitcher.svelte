<script>
  import { language, toggleLanguage } from '../i18n/store';
</script>

<button class="lang-btn" on:click={toggleLanguage} title="Toggle language">
  {$language === 'en' ? 'CN' : 'EN'}
</button>

<style>
  .lang-btn {
    padding: 0.25rem 0.5rem;
    background: transparent;
    border: none;
    border-radius: 3px;
    color: var(--text-muted);
    cursor: pointer;
    font-size: 0.75rem;
    font-weight: 600;
    transition: all 0.2s ease;
  }

  .lang-btn:hover {
    border-color: var(--text-primary);
    color: var(--text-primary);
  }
</style>
