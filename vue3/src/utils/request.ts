import axios from 'axios';
import { ElMessage } from 'element-plus';
// import useUserStore from '@/store/modules/user.ts';
import { GET_TOKEN } from '@/utils/token.ts';

// 创建 axios 实例
const request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 5000,
});
// 请求拦截器
request.interceptors.request.use(config => {
  const myConfig = config;
  // config 配置对象, headers 属性请求头, 经常给服务器端携带公共参数
  const token = GET_TOKEN();
  if (token && myConfig.headers) {
    myConfig.headers.token = token;
  }
  return myConfig;
});
// 响应拦截器
request.interceptors.response.use(
  response => {
    // 简化数据
    return response.data;
  },
  error => {
    // 处理网络错误
    let msg;
    const status = error.response?.status;
    switch (status) {
      case 401:
        msg = 'toke过期';
        break;
      case 403:
        msg = '无权访问';
        break;
      case 404:
        msg = '请求地址错误';
        break;
      case 500:
        msg = '服务器出现问题';
        break;
      default:
        msg = '请求超时';
    }
    ElMessage({
      type: 'error',
      message: msg,
    });
    return Promise.reject(error);
  }
);
export default request;
