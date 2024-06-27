<script setup lang="ts">
  defineProps({
    prefix: {
      type: String,
      default: '#icon-',
    },
    // eslint-disable-next-line vue/require-default-prop
    name: String,
    color: {
      type: String,
      default: '',
    },
    width: {
      type: String,
      default: '16px',
    },
    height: {
      type: String,
      default: '16px',
    },
  });
</script>

<template>
  <!--  svg:图标外层容器节点, 内部需要与 use 标签结合使用  -->
  <svg :style="{ height, width }">
    <use :xlink:href="prefix + name" fill="color"></use>
  </svg>
</template>

<style scoped></style>
