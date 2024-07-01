<script setup lang="ts" name="Setting">
  import useLayoutSettingStore from '@/store/modules/setting.ts';
  import useUserStore from '@/store/modules/user.ts';
  import { useRoute, useRouter } from 'vue-router';
  import { nextTick } from 'vue';

  const layoutSettingStore = useLayoutSettingStore();
  const userStore = useUserStore();
  const $router = useRouter();
  const $route = useRoute();
  const fullScreen = () => {
    // DOM对象的一个属性: 可以用来判断当前是不是全屏模式 (true/ null)
    const full = document.fullscreenElement;
    if (!full) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };
  const logout = () => {
    userStore.userLogout();
    nextTick(() => {
      $router.push({ path: '/login', query: { redirect: $route.path } });
    });
  };
</script>

<template>
  <el-button
    size="small"
    icon="Refresh"
    circle
    @click="layoutSettingStore.updateRefresh()"
  ></el-button>
  <el-button size="small" icon="FullScreen" circle @click="fullScreen"></el-button>
  <el-button size="small" icon="Setting" circle></el-button>
  <img :src="userStore.avatar" alt="用户图像" />
  <el-dropdown>
    <span class="el-dropdown-link">
      {{ userStore.username }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item icon="Plus" @click="logout()">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style scoped>
  img {
    width: 24px;
    height: 24px;
    margin: 0 10px;
    border-radius: 50%;
  }
</style>
