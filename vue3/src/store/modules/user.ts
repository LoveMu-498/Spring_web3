// eslint-disable-next-line import/no-extraneous-dependencies
import { defineStore } from 'pinia';
import { reqLogin, reqUserInfo } from '@/api/user/index.ts';
import type { loginForm, loginResponseData } from '@/api/user/type.ts';
import { GET_TOKEN, REMOVE_TOKEN, SET_TOKEN } from '@/utils/token.ts';
import { constantRoute } from '@/router/routes.ts';
import type { UserState } from './types/type.ts';
// 引入路由

const useUserStore = defineStore('User', {
  state: (): UserState => {
    return {
      token: GET_TOKEN(),
      // 仓库存储生成菜单需要数组(路由)
      menuRoutes: constantRoute,
      username: '',
      avatar: '',
    };
  },
  // 异步 | 逻辑
  actions: {
    async userLogin(data: loginForm) {
      const result: loginResponseData = await reqLogin(data);
      if (result.code === 200) {
        this.token = result.data.token as string;
        // 持久化存储
        SET_TOKEN(result.data.token as string);
        // 让 async 返回成功的 promise
        return 'ok';
      }
      return Promise.reject(new Error(result.data.message));
    },
    async userInfo() {
      const result = await reqUserInfo();
      if (result.code === 200) {
        this.username = result.data.checkUser.username;
        this.avatar = result.data.checkUser.avatar;
      } else {
      }
    },
    async userLogout() {
      REMOVE_TOKEN();
      this.token = null;
      this.username = '';
      this.avatar = '';
    },
  },
  getters: {},
});

export default useUserStore;
