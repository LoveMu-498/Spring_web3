<script setup lang="ts">
  import { onMounted } from 'vue';
  import useUserStore from '@/store/modules/user.ts';

  const userStore = useUserStore();
  onMounted(() => {
    userStore.userInfo();
  });
</script>

<template>
  <div>
    <h1>我是一级路由home{{ userStore.username }}</h1>
  </div>
</template>

<style scoped></style>
