import request from '@/utils/request.ts';
import { PermissionResponseData, PermissionType, PermissionVo } from '@/api/acl/permission/type.ts';
import { ArrayAble, ResponseData } from '@/api/type.ts';
// eslint-disable-next-line import/no-extraneous-dependencies
import qs from 'qs';

// eslint-disable-next-line no-shadow
enum API {
  GET_PERMISSION_LIST = '/admin/acl/permission',
  GET_PERMISSION_LIST_BY_ID = '/admin/acl/permission/toAssign',
  DO_ASSIGN_URL = '/admin/acl/permission/doAssign',
  DO_ASSIGN_ACL_URL = '/admin/acl/permission/doAssignAcl',
  SAVE_PERMISSION_URL = '/admin/acl/permission/save',
  UPDATE_PERMISSION_URL = '/admin/acl/permission/update',
  DELETE_PERMISSION_URL = '/admin/acl/permission/remove',
}

export const reqGetPermissionList = (): Promise<PermissionResponseData> =>
  request.get<any, PermissionResponseData>(API.GET_PERMISSION_LIST, {});

export const reqGetPermissionListById = (roleId: number): Promise<PermissionResponseData> =>
  request.get<any, PermissionResponseData>(`${API.GET_PERMISSION_LIST_BY_ID}/${roleId}`, {});

export const reqDoAssign = (
  roleId: number,
  permissionId: ArrayAble<number>
): Promise<ResponseData> =>
  request.post<any, ResponseData>(API.DO_ASSIGN_URL, null, {
    params: { roleId, permissionId },
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
  });

export const reqDoAssignAcl = (permissionVo: PermissionVo): Promise<ResponseData> =>
  request.post<any, ResponseData>(API.DO_ASSIGN_ACL_URL, permissionVo);

export const reqSavePermission = (permission: PermissionType): Promise<ResponseData> =>
  request.post<any, ResponseData>(API.SAVE_PERMISSION_URL, permission);

export const reqUpdatePermission = (permission: PermissionType): Promise<ResponseData> =>
  request.put<any, ResponseData>(API.UPDATE_PERMISSION_URL, permission);

export const reqSaveOrUpdatePermission = (permission: PermissionType): Promise<ResponseData> => {
  if (permission.id) {
    return reqUpdatePermission(permission);
  }
  return reqSavePermission(permission);
};

export const reqRemovePermission = (id: number): Promise<ResponseData> =>
  request.delete<any, ResponseData>(`${API.DELETE_PERMISSION_URL}/${id}`, {});
