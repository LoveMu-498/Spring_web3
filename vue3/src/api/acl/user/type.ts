import { ResponseData } from '@/api/type.ts';

export interface User {
  id?: number;
  createTime?: Date;
  updateTime?: Date;
  username: string;
  password: string;
  name: string;
  phone: string;
  roleName: string;
}

export interface UserInfoResponseData extends ResponseData {
  data: User;
}

export type UserList = Array<User>;

export interface UserResponseData extends ResponseData {
  data: {
    records: UserList;
    total: number;
    size: number;
    current: number;
    orders: [];
    optimizeCountSql: boolean;
    hitCount: boolean;
    countId: number | null;
    macLimit: number | null;
    searchCount: boolean;
    pages: number;
  };
}
