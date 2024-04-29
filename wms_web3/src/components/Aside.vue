<script setup lang="ts">
import {Avatar, Flag, House, Menu as IconMenu, Message, Setting, User, UserFilled} from '@element-plus/icons-vue'

defineProps(['collapseFlag'])
</script>

<template>
  <el-scrollbar>
      <el-menu :default-openeds="['1', '3']" :collapse="collapseFlag"
               style="height: 100vh;" background-color="#545c64" active-text-color="#ffd04b"
               text-color="#fff" default-active="/Home" :collapse-transition="false"
               class="el-menu-aside" router>
        <el-menu-item index="/Home">
          <el-icon><House /></el-icon>
          <template #title>
            <div>首页</div>
          </template>
        </el-menu-item>
        <el-sub-menu index="1">
          <template #title>
            <el-icon><User /></el-icon><div v-if="!collapseFlag">账号管理</div>
          </template>
          <el-menu-item index="2-1">
            <template #title>
              <el-icon><UserFilled /></el-icon><div>账号导航一</div>
            </template>
          </el-menu-item>
          <el-menu-item index="2-2">
            <template #title>
              <el-icon><Avatar /></el-icon><div>账号导航二</div>
            </template>
          </el-menu-item>
          <!--<el-menu-item-group title="Group 2">-->
          <!--  <el-menu-item index="1-3">Option 3</el-menu-item>-->
          <!--  <el-menu-item index="1-4-1">Option 4-1</el-menu-item>-->
          <!--</el-menu-item-group>-->
        </el-sub-menu>
        <el-menu-item index="2">
          <el-icon><User /></el-icon>
          <template #title>
            <div>导航一</div>
          </template>
        </el-menu-item>
        <el-menu-item index="3">
          <el-icon><User /></el-icon>
          <template #title>
            <div>导航二</div>
          </template>
        </el-menu-item>
        <el-menu-item index="/About">
          <el-icon><Flag /></el-icon>
          <template #title>
            <div>关于</div>
          </template>
        </el-menu-item>
      </el-menu>
    </el-scrollbar>
</template>

<style scoped>
.el-aside {
  color: var(--el-text-color-primary);
  background: var(--el-color-primary-light-8);
}
.el-menu {
  border-right: none;
}
.el-menu-aside:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>