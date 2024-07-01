<script setup lang="ts">
  import useUserStore from '@/store/modules/user.ts';

  const userStore = useUserStore();
</script>

<template>
  <div>
    <h1>我是一级路由home{{ userStore.username }}</h1>
  </div>
</template>

<style scoped></style>
