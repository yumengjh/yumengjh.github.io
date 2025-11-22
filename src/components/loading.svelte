<div class="loading-container">
  <div class="loading-dots">
    <div class="dot dot-1"></div>
    <div class="dot dot-2"></div>
    <div class="dot dot-3"></div>
  </div>
</div>

<style>
  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
    width: 100%;
  }

  .loading-dots {
    display: flex;
    gap: 0.75rem;
    align-items: center;
    justify-content: center;
  }

  .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--accent);
    opacity: 0.4;
    animation: pulse 1.4s ease-in-out infinite;
  }

  .dot-1 {
    animation-delay: 0s;
  }

  .dot-2 {
    animation-delay: 0.2s;
  }

  .dot-3 {
    animation-delay: 0.4s;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 0.4;
      transform: scale(1);
    }
    50% {
      opacity: 1;
      transform: scale(1.2);
    }
  }
</style>
