// eslint-disable-next-line import/no-extraneous-dependencies
import { defineStore } from 'pinia';
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user/index.ts';
import { GET_TOKEN, REMOVE_TOKEN, SET_TOKEN } from '@/utils/token.ts';
import { constantRoute } from '@/router/routes.ts';
import type { loginFormData, loginResponseData, userInfoResponseData } from '@/api/user/type.ts';

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
    async userLogin(data: loginFormData) {
      const result: loginResponseData = await reqLogin(data);
      if (result.code === 200) {
        this.token = result.data;
        console.log(result);
        // 持久化存储
        SET_TOKEN(result.data);
        // 让 async 返回成功的 promise
        return 'ok';
      }
      return Promise.reject(new Error(result.data));
    },
    async userInfo() {
      const result: userInfoResponseData = await reqUserInfo();
      if (result.code === 200) {
        this.username = result.data.name;
        this.avatar = result.data.avatar;
        return 'OK';
      }
      return Promise.reject(new Error(result.message));
    },
    async userLogout() {
      const result: any = await reqLogout();
      // console.log(result);
      if (result.code === 200) {
        this.token = null;
        this.username = '';
        this.avatar = '';
        REMOVE_TOKEN();
        return 'OK';
      }
      return Promise.reject(new Error(result.message));
    },
  },
  getters: {},
});

export default useUserStore;
