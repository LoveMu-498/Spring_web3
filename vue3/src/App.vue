<script setup lang="ts">
const str = 'I Love China';
</script>

<template>
  <div class="box">
    <h1>App</h1>
    {{ str }}
  </div>
</template>

<style scoped lang="scss">
.box {
  width: 600px;
  height: 400px;
  background: #000;
  h1 {
    color: #fff;
  }
}
</style>
