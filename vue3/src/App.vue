<template>
  <div>
    <h1>SVG测试</h1>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';
  import request from '../utils/request.ts';

  onMounted(() => {
    request({
      url: '/user/login',
      method: 'post',
      data: {
        username: 'admin',
        password: 'admin',
      },
    });
  });
</script>
<style scoped lang="scss">
  div {
    h1 {
      color: red;
    }
  }
</style>
