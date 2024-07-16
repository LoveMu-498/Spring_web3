<script setup lang="ts">
  import { User, Lock } from '@element-plus/icons-vue';
  import { reactive, ref } from 'vue';
  import useUserStore from '@/store/modules/user.ts';
  // eslint-disable-next-line import/no-extraneous-dependencies
  import { useRoute, useRouter } from 'vue-router';
  import { ElNotification, FormRules } from 'element-plus';
  import { getTime } from '@/utils/time.ts';
  import type { loginFormData } from '@/api/user/type.ts';

  // 获取 el-form组件
  const loginForms = ref();
  // 获取路由器
  const $router = useRouter();
  const $route = useRoute();
  const useStore = useUserStore();
  const loading = ref(false);
  // eslint-disable-next-line no-import-assign,no-redeclare
  const loginFormData = reactive({
    username: 'admin',
    password: '111111',
  });

  const rules = reactive<FormRules<loginFormData>>({
    username: [
      { required: true, message: 'Please input username', trigger: 'blur' },
      { min: 5, max: 20, message: 'Username length should be 5 to 20', trigger: 'blur' },
      {
        validator: (rule: any, value: any, callback: any) => {
          if (value === 'lalala' || rule == null) {
            callback(new Error("'lalala' is illegal account"));
          }
          callback();
        },
        trigger: 'change',
      },
    ],
    password: [
      { required: true, message: 'Please input password', trigger: 'blur' },
      { min: 5, max: 20, message: 'Password should be 5 to 20', trigger: 'blur' },
      {
        // 只允许有 数字字母
        pattern: /^[0-9a-zA-Z]+$/,
        message: 'The password cannot contain special characters',
        trigger: 'blur',
      },
    ],
  });

  const login = async () => {
    try {
      await loginForms.value.validate();
      loading.value = true;
      await useStore.userLogin(loginFormData);
      const path = String($route.query.redirect) || '/';
      await $router.push({ path });
      ElNotification({
        type: 'success',
        title: `${getTime()}好`,
        message: '欢迎回来',
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
        <el-form
          ref="loginForms"
          class="login-form"
          :model="loginFormData"
          :rules="rules"
          scroll-into-view-options
        >
          <h1>Hello</h1>
          <h2>欢迎来到 XXXX</h2>
          <el-form-item prop="username">
            <el-input v-model="loginFormData.username" type="text" :prefix-icon="User"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginFormData.password"
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
