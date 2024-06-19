<template>
  <div class="box">
    <h1>{{ a }}</h1>
  </div>
  {{ a }}
</template>

<script setup lang="ts">
  const a = '我爱你中国';
</script>

<style scoped lang="css">
  .box {
    width: 800px;
    height: 500px;
    background: #000;

    h1 {
      color: #fff;
      text-align: center;
    }
  }
</style>
