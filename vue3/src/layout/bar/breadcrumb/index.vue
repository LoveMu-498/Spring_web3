<script setup lang="ts" name="Breadcrumb">
  import { useRoute } from 'vue-router';
  import { ArrowRight } from '@element-plus/icons-vue';
  import useLayoutSettingStore from '@/store/modules/setting.ts';

  const $route = useRoute();
  const layoutSettingStore = useLayoutSettingStore();
</script>

<template>
  <el-icon @click="layoutSettingStore.changeFold()">
    <component :is="layoutSettingStore.fold ? 'Fold' : 'Expand'" />
  </el-icon>
  <el-breadcrumb :separator-icon="ArrowRight">
    <!-- 动态展示路由名字和标题 -->
    <el-breadcrumb-item
      v-for="(item, index) in $route.matched"
      v-show="!item.meta.hidden"
      :key="index"
      :to="{ path: item.path }"
    >
      <el-icon>
        <component :is="item.meta.icon" />
      </el-icon>
      <span> {{ item.meta.title }} </span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<style scoped lang="scss">
  .el-icon {
    margin-right: 5px;
    vertical-align: top;
    :hover {
      cursor: pointer;
    }
  }
</style>
