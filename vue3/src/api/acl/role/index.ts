import request from '@/utils/request.ts';
import { Role, RoleInfoResponseData, RoleListResponseData } from '@/api/acl/role/type.ts';
import { ResponseData, ArrayAble } from '@/api/type.ts';

// eslint-disable-next-line no-shadow
enum API {
  ROLE_LIST_URL = '/admin/acl/role',
  ROLE_UPDATE_URL = '/admin/acl/role/update',
  ROLE_SAVE_URL = '/admin/acl/role/save',
  ROLE_DELETE_URL = '/admin/acl/role/remove',
  ROLE_GET_URL = '/admin/acl/role/get',
  ROLE_DELETE_LIST_URL = '/admin/acl/role/batchRemove',
}

export const reqGetRoleList = (
  page: number,
  limit: number,
  role: Role
): Promise<RoleListResponseData> =>
  request.get<any, RoleListResponseData>(`${API.ROLE_LIST_URL}/${page}/${limit}`, { params: role });

export const reqUpdateRoleInfo = (role: Role): Promise<ResponseData> =>
  request.put<any, ResponseData>(API.ROLE_UPDATE_URL, role);

export const reqSaveRoleInfo = (role: Role): Promise<ResponseData> =>
  request.post<any, ResponseData>(API.ROLE_SAVE_URL, role);

export const reqSaveOrUpdateRole = (role: Role): Promise<ResponseData> => {
  if (role.id) {
    return reqUpdateRoleInfo(role);
  }
  return reqSaveRoleInfo(role);
};

export const reqDeleteRole = (id: number): Promise<ResponseData> =>
  request.delete<any, ResponseData>(`${API.ROLE_DELETE_URL}/${id}`);

export const reqGetRole = (id: number): Promise<RoleInfoResponseData> =>
  request.get<any, RoleInfoResponseData>(`${API.ROLE_GET_URL}/${id}`);

export const reqDeleteRoleList = (idList: ArrayAble<number>) =>
  request.delete<any, ResponseData>(API.ROLE_DELETE_LIST_URL, { data: idList });
