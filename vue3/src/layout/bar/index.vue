<script setup lang="ts" name="Bar">
  import Breadcrumb from '@/layout/bar/breadcrumb/index.vue';
  import Setting from '@/layout/bar/setting/index.vue';
</script>

<template>
  <div class="bar">
    <div class="bar_left">
      <Breadcrumb />
    </div>
    <div class="bar_right">
      <Setting />
    </div>
  </div>
</template>

<style scoped lang="scss">
  .bar {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    background-image: linear-gradient(
      to right,
      rgb(232, 223, 223),
      rgb(201, 178, 178),
      rgb(197, 165, 165)
    );

    .bar_left {
      display: flex;
      align-items: center;
      margin-left: 20px;
    }

    .bar_right {
      display: flex;
      align-items: center;
    }
  }
</style>
