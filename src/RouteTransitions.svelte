<script>
  import { useLocation } from "svelte-navigator";
  const location = useLocation();
  const duration = 500;
</script>

<div class="transition-container">
  {#key $location.pathname}
    <div class="transition-wrapper compress" style="animation-duration: {duration}ms;">
      <slot />
    </div>
  {/key}
</div>

<style>
.transition-container {
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr;
  width: 100%;
  height: 100%;
  overflow: hidden;
  perspective: 800px; /* 3D 效果 */
}

.transition-wrapper {
  grid-area: 1 / 1;
  width: 100%;
  height: 100%;
  transform-origin: center;
}

/* 旧页面压缩消失 + 新页面展开 */
@keyframes compressExpand {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(0, 0.1) rotateX(10deg);
    opacity: 0;
  }
  51% {
    transform: scale(0, 0.1) rotateX(-10deg);
  }
  100% {
    transform: scale(1) rotateX(0deg);
    opacity: 1;
  }
}

.compress {
  animation-name: compressExpand;
  animation-timing-function: ease-in-out;
}
</style>
