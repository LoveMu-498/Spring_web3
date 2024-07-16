// 统一管理项目用户相关接口
import request from '@/utils/request.ts';
import type { loginFormData, loginResponseData, userInfoResponseData } from './type.ts';

enum API {
  LOGIN_URL = '/admin/acl/index/login',
  USERINFO_URL = '/admin/acl/index/info',
  LOGOUT_URL = '/admin/acl/index/logout',
}

/**
 * 登录接口函数
 * @param data {username: string, password: string}
 * @return Promise<loginResponseData>
 *   */
export const reqLogin = (data: loginFormData) =>
  request.post<any, loginResponseData>(API.LOGIN_URL, data);

/**
 * 登录接口函数
 * @return Promise<userInfoResponseData>
 *   */
export const reqUserInfo = () => request.get<any, userInfoResponseData>(API.USERINFO_URL);

/**
 * 登录接口函数
 * @return any
 *   */
export const reqLogout = () => request.post<any, any>(API.LOGOUT_URL);
