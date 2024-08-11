import { ResponseData } from '@/api/type.ts';
import { RoleList } from '@/api/acl/role/type.ts';

export interface AssignResponseData extends ResponseData {
  data: {
    assignRoles: RoleList;
    allRolesList: RoleList;
  };
}

export interface PermissionType {
  id: number;
  createTime?: string;
  updateTime?: string;
  pid: number;
  name: string;
  code: string;
  toCode: string;
  type: number;
  status: null;
  level: number;
  select: boolean;
  children?: PermissionType[];
}

export interface PermissionResponseData extends ResponseData {
  data: PermissionType[];
}

export interface PermissionVo {
  permissionIdList: Array<number>;
  roleId: number;
}
