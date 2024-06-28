<script setup lang="ts">
  import { User, Lock } from '@element-plus/icons-vue';
  import { reactive, ref } from 'vue';
  import useUserStore from '@/store/modules/user.ts';
  // eslint-disable-next-line import/no-extraneous-dependencies
  import { useRouter } from 'vue-router';
  import { ElNotification } from 'element-plus';

  // 获取路由器
  const $router = useRouter();
  const useStore = useUserStore();
  const loading = ref(false);
  const loginForm = reactive({
    username: 'admin',
    password: 'admin',
  });

  const login = async () => {
    try {
      loading.value = true;
      await useStore.userLogin(loginForm);
      $router.push({ path: '/' });
      ElNotification({
        type: 'success',
        message: '登录成功',
      });
    } catch (e) {
      ElNotification({
        type: 'error',
        message: (e as Error).message,
      });
    } finally {
      loading.value = false;
    }
  };
</script>

<template>
  <div class="login-container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form class="login-form">
          <h1>Hello</h1>
          <h2>欢迎来到 XXXX</h2>
          <el-form-item>
            <el-input v-model="loginForm.username" type="text" :prefix-icon="User"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="loginForm.password"
              type="password"
              :prefix-icon="Lock"
              :show-password="true"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button :loading="loading" class="login_btn" type="primary" @click="login">
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
  .login-container {
    width: 100%;
    height: 100vh;
    background: url('@/assets/images/background.jpg') no-repeat;
    background-size: cover;
    .login-form {
      position: relative;
      width: 80%;
      top: 30vh;
      background: url('@/assets/images/login_form.png') no-repeat;
      background-size: cover;
      padding: 40px;
      h1 {
        color: #fff;
        font-size: 40px;
      }
      h2 {
        color: #fff;
        font-size: 20px;
        margin: 20px 0;
      }
      .login_btn {
        width: 100%;
      }
    }
  }
</style>
