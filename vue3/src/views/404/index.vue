<script setup lang="ts">
  import { useRouter } from 'vue-router';

  const $router = useRouter();

  const toHome = () => {
    $router.push('/');
  };
</script>

<template>
  <div class="box">
    <img src="../../assets/images/error_images/404.png" alt="404报错图片" />
    <button @click="toHome">首页</button>
  </div>
</template>

<style scoped lang="scss">
  .box {
    width: 100vh;
    height: 100vw;
    background: yellowgreen;
    display: flex;
    justify-content: center;
    img {
      width: 800px;
      height: 400px;
    }
    button {
      width: 50px;
      height: 50px;
    }
  }
</style>
