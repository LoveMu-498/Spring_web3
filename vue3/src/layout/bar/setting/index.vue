<script setup lang="ts" name="Setting">
  import useLayoutSettingStore from '@/store/modules/setting.ts';
  import useUserStore from '@/store/modules/user.ts';
  import { useRoute, useRouter } from 'vue-router';
  import { ElMessage } from 'element-plus';
  import { ref } from 'vue';

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
  const logout = async () => {
    try {
      await userStore.userLogout();
      $router.push({ path: '/login', query: { redirect: $route.path } });
    } catch (e) {
      ElMessage({ type: 'error', message: (e as Error).message });
    }
  };

  const color = ref('rgba(255, 69, 0, 0.68)');
  const predefineColors = ref([
    '#ff4500',
    '#ff8c00',
    '#ffd700',
    '#90ee90',
    '#00ced1',
    '#1e90ff',
    '#c71585',
    'rgba(255, 69, 0, 0.68)',
    'rgb(255, 120, 0)',
    'hsv(51, 100, 98)',
    'hsva(120, 40, 94, 0.5)',
    'hsl(181, 100%, 37%)',
    'hsla(209, 100%, 56%, 0.73)',
    '#c7158577',
  ]);
  const dark = ref<boolean>(false);
  const changeDark = () => {
    const html = document.documentElement;
    if (dark.value) {
      html.className = 'dark';
    } else {
      html.className = '';
    }
  };
  const changeColor = () => {
    // document.documentElement 是全局变量时
    const el = document.documentElement;
    // const el = document.getElementById('xxx')

    // 获取 css 变量
    getComputedStyle(el).getPropertyValue(`--el-color-primary`);

    // 设置 css 变量
    el.style.setProperty('--el-color-primary', color.value);
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
  <el-popover placement="bottom" title="主题设置" :width="300" trigger="hover">
    <el-form>
      <el-form-item label="主题颜色">
        <el-color-picker
          v-model="color"
          size="small"
          show-alpha
          :predefine="predefineColors"
          :teleported="false"
          @change="changeColor"
        />
      </el-form-item>
      <el-form-item label="暗黑模式">
        <el-switch
          v-model="dark"
          size="small"
          inline-prompt
          active-color="Sunny"
          inactive-icon="MoonNight"
          @change="changeDark"
        />
      </el-form-item>
    </el-form>
    <template #reference>
      <el-button size="small" icon="Setting" circle></el-button>
    </template>
  </el-popover>
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
