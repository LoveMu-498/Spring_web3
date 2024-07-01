<script setup lang="ts" name="Layout">
  import { useRoute } from 'vue-router';
  // 引入左侧菜单logo子组件
  import Logo from '@/layout/logo/index.vue';
  import Menu from '@/layout/menu/index.vue';
  import Bar from '@/layout/bar/index.vue';
  import Main from '@/layout/main/index.vue';
  // 获取用户相关的小仓库
  import useUserStore from '@/store/modules/user.ts';
  import useLayoutSettingStore from '@/store/modules/setting.ts';
  import { storeToRefs } from 'pinia';

  const userStore = useUserStore();
  const layoutSettingStore = useLayoutSettingStore();
  const { fold } = storeToRefs(layoutSettingStore);
  const $route = useRoute();
</script>

<template>
  <div class="layout_container">
    <!-- 左侧菜单 -->
    <div class="layout_slider" :class="{ fold: !!fold }">
      <Logo></Logo>
      <!-- 展示菜单 -->
      <!-- 滚动组件 -->
      <el-scrollbar class="scrollbar">
        <!-- 菜单组件 -->
        <el-menu
          background-color="#001529"
          text-color="#bdbdbd"
          active-text-color="yellowgreen"
          :default-active="$route.path"
          :collapse="fold"
          router
          unique-opened
        >
          <!-- 根据路由动态生成菜单 -->
          <Menu :menuList="userStore.menuRoutes" />
        </el-menu>
      </el-scrollbar>
    </div>
    <!-- 顶部导航 -->
    <div class="layout_bar" :class="{ fold: !!fold }">
      <Bar />
    </div>
    <!-- 内容展示区域 -->
    <div class="layout_main" :class="{ fold: !!fold }">
      <Main />
    </div>
  </div>
</template>

<style scoped lang="scss">
  .layout_container {
    width: 100%;
    height: 100vh;

    .layout_slider {
      width: $base-menu-width;
      height: 100vh;
      background: $base-menu-background;
      transition: all 0.3s;
      color: white;

      .scrollbar {
        width: 100%;
        height: calc(100vh - $base-menu-logo-height);

        .el-menu {
          background: $base-menu-background;
          border-right: none;
          //height: calc(100vh - $base-menu-logo-height);
        }
      }

      &.fold {
        width: $base-menu-min-width;
      }
    }

    .layout_bar {
      position: absolute;
      width: calc(100% - $base-menu-width);
      height: $base-bar-height;
      top: 0;
      left: $base-menu-width;
      transition: all 0.3s;

      &.fold {
        width: calc(100% - $base-menu-min-width);
        left: $base-menu-min-width;
      }
    }

    .layout_main {
      position: fixed;
      width: calc(100% - $base-menu-width);
      height: calc(100vh - $base-bar-height);
      left: $base-menu-width;
      top: $base-bar-height;
      padding: 20px;
      background: gray;
      overflow: auto;
      transition: all 0.3s;

      &.fold {
        width: calc(100% - $base-menu-min-width);
        left: $base-menu-min-width;
      }
    }
  }
</style>
