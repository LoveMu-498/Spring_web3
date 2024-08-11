import { SkuInfoList } from '@/api/product/sku/type.ts';
import { ResponseData } from '@/api/type.ts';

export interface RoleVo {
  roleIdList: Array<number>;
  userId: number;
}

export interface Role {
  id?: number;
  roleName: string;
  remark: string | null;
  createTime?: string;
  updateTime?: string;
}

export interface RoleInfoResponseData extends ResponseData {
  data: Role;
}

export type RoleList = Array<Role>;

export interface RoleListResponseData extends ResponseData {
  data: {
    records: RoleList;
    total: number;
    size: number;
    current: number;
    orders: Array<SkuInfoList>;
    optimizeCountSql: boolean;
    hitCount: boolean;
    countId: number;
    maxLimit: number;
    searchCount: boolean;
    pages: number;
  };
}
