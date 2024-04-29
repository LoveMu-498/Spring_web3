<script setup lang="ts">

import { ArrowDownBold, DArrowLeft, DArrowRight } from '@element-plus/icons-vue'
import {ref} from "vue";
const collapseFlag = ref(false);
const props = defineProps(['toggleCollapse'])

const toggleCollapseF = () => {
  collapseFlag.value = !collapseFlag.value;
  props.toggleCollapse(collapseFlag.value);
}

</script>
<template>
  <div class="toolbar">
    <div @click="toggleCollapseF" style="cursor: pointer">
      <component :is="collapseFlag ? DArrowRight : DArrowLeft"
                 style="width: 21px; height:21px; font-size: 20px; line-height: 42px" />
    </div>
    <div style="flex: 1; text-align: center; font-size: 32px; line-height: 42px">
      <span>欢迎来到仓库管理系统</span>
    </div>
    <el-dropdown>
      <el-icon style="margin-right: 8px; margin-top: 1px">
        <ArrowDownBold />
      </el-icon>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="console.log('123')">个人中心</el-dropdown-item>
          <el-dropdown-item @click="console.log('123')">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <span>Tom</span>
  </div>
</template>

<style scoped>
  .el-header {
    position: relative;
    background-color: var(--el-color-primary-light-7);
    color: var(--el-text-color-primary);
  }
  .toolbar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    right: 20px;
    width: 100%;
  }

</style>