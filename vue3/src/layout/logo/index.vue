<script setup lang="ts" name="Logo">
  import setting from '@/setting.ts';
</script>

<template>
  <div v-if="!setting.logoHidden" class="logo">
    <img :src="setting.logo" alt="logo" />
    <p>{{ setting.title }}</p>
  </div>
</template>

<style scoped lang="scss">
  .logo {
    width: 100%;
    height: $base-menu-logo-height;
    color: white;
    display: flex;
    align-items: center;
    padding: 10px;
    img {
      width: 40px;
      height: 40px;
    }
    p {
      font-size: $base-logo-title-fontSize;
      margin-left: 10px;
      white-space: nowrap;
      overflow: hidden;
    }
  }
</style>
