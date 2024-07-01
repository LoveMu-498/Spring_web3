<script setup lang="ts" name="Main">
  import { watch, ref, nextTick } from 'vue';
  import useLayoutSettingStore from '@/store/modules/setting.ts';

  const layoutStore = useLayoutSettingStore();
  watch(
    () => layoutStore.refresh,
    () => {
      flag.value = false;
      nextTick(() => {
        flag.value = true;
      });
    }
  );
  const flag = ref(true);
</script>

<template>
  <!-- 路由组件出口的位置 -->
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <!-- 渲染layout一级路由组件的子路由 -->
      <component :is="Component" v-if="flag" />
    </transition>
  </router-view>
</template>

<style scoped lang="scss">
  .fade-enter-from {
    opacity: 0;
  }
  .fade-enter-active {
    transition: all 0.3s;
  }
  .fade-enter-to {
    opacity: 1;
  }
</style>
