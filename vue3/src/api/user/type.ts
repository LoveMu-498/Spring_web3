// 定义用户相关数据的ts类型
export interface loginFormData {
  username: string;
  password: string;
}

// 定义全部接口返回数据都拥有的ts类型
interface ResponseData {
  code: number;
  message: string;
  ok: boolean;
}

export interface loginResponseData extends ResponseData {
  data: string;
}

export interface userInfoResponseData extends ResponseData {
  data: {
    buttons: string[];
    rules: string[];
    name: string;
    avatar: string;
  };
}
