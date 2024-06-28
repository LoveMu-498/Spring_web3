// eslint-disable-next-line import/no-extraneous-dependencies
import { defineStore } from 'pinia';
import { reqLogin } from '@/api/user/index.ts';
import type { loginForm, loginResponseData } from '@/api/user/type.ts';
import { GET_TOKEN, SET_TOKEN } from '@/utils/token.ts';
import type { UserState } from './types/type.ts';

const useUserStore = defineStore('User', {
  state: (): UserState => {
    return {
      token: GET_TOKEN(),
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
  },
  getters: {},
});

export default useUserStore;
