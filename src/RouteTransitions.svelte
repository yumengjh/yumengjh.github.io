<!-- src/RouteTransitions.svelte -->
<script>
  import { useLocation } from "svelte-navigator";
  import { fade } from "svelte/transition";

  const location = useLocation();

  // 设置动画持续时间（毫秒）
  const duration = 300;
</script>

<!-- 
  核心原理：
  使用 Grid 布局让子元素重叠在同一个网格区域 (grid-area: 1/1)。
  这样当一个页面 fade-out，另一个 page fade-in 时，它们是原位重叠的。
-->
<div class="transition-container">
  {#key $location.pathname}
    <div
      class="transition-wrapper"
      in:fade={{ duration: duration, delay: duration }}
      out:fade={{ duration: duration }}
    >
      <!-- 这里通过 slot 插入具体的 Route 定义 -->
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
    height: 100%; /* 确保占满父容器 */
    overflow: hidden; /* 防止动画溢出 */
  }

  .transition-wrapper {
    grid-area: 1 / 1; /* 强制新旧页面处于同一位置 */
    width: 100%;
    height: 100%;
  }
</style>
