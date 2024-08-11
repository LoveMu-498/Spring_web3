import { ResponseData } from '@/api/type.ts';

// 定义用户相关数据的ts类型
export interface loginFormData {
  username: string;
  password: string;
}

export interface loginResponseData extends ResponseData {
  data: string;
}

export interface userInfoResponseData extends ResponseData {
  data: {
    buttons: string[];
    roles: string[];
    routes: string[];
    name: string;
    avatar: string;
  };
}
