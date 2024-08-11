import request from '@/utils/request.ts';
import { User, UserInfoResponseData, UserResponseData } from '@/api/acl/user/type.ts';
import { AssignResponseData } from '@/api/acl/permission/type.ts';
import { RoleVo } from '@/api/acl/role/type.ts';
import { ArrayAble, ResponseData } from '@/api/type.ts';
// eslint-disable-next-line import/no-extraneous-dependencies
import qs from 'qs';

// eslint-disable-next-line no-shadow
enum API {
  USER_LIST_URL = '/admin/acl/user',
  USER_REMOVE_URL = '/admin/acl/user/remove',
  USER_REMOVE_LIST_URL = '/admin/acl/user/batchRemove',
  USER_SAVE_URL = '/admin/acl/user/save',
  USER_UPDATE_URL = '/admin/acl/user/update',
  USER_GET_INFO_URL = '/admin/acl/user/get',
  USER_ASSIGN_URL = '/admin/acl/user/toAssign',
  USER_DO_ASSIGN_URL = '/admin/acl/user/doAssign',
  USER_DO_ASSIGN_ROLE_URL = '/admin/acl/user/doAssignRole',
}

export const reqGetUserList = (
  page: number,
  limit: number,
  userInfo: User
): Promise<UserResponseData> =>
  request.get<any, UserResponseData>(`${API.USER_LIST_URL}/${page}/${limit}`, { params: userInfo });

export const reqRemoveUser = (id: number): Promise<ResponseData> =>
  request.delete<any, ResponseData>(`${API.USER_REMOVE_URL}/${id}`, {});

export const reqRemoveUserList = (idList: Array<number>): Promise<ResponseData> =>
  request.delete<any, ResponseData>(API.USER_REMOVE_LIST_URL, { data: idList });

export const reqSaveUserInfo = (userInfo: User): Promise<ResponseData> =>
  request.post<any, ResponseData>(API.USER_SAVE_URL, userInfo);

export const reqUpdateUserInfo = (userInfo: User): Promise<ResponseData> =>
  request.put<any, ResponseData>(API.USER_UPDATE_URL, userInfo);

export const reqSaveOfUpdateUserInfo = (userInfo: User): Promise<ResponseData> => {
  if (userInfo.id) {
    return reqUpdateUserInfo(userInfo);
  }
  return reqSaveUserInfo(userInfo);
};

export const reqGetUserInfoById = (id: number): Promise<UserInfoResponseData> =>
  request.get<any, UserInfoResponseData>(`${API.USER_GET_INFO_URL}/${id}`, {});

export const reqToAssign = (adminId: number): Promise<AssignResponseData> =>
  request.get<any, AssignResponseData>(`${API.USER_ASSIGN_URL}/${adminId}`, {});

export const reqDoAssign = (adminId: number, roleId: ArrayAble<number>): Promise<ResponseData> =>
  request.post<any, ResponseData>(API.USER_DO_ASSIGN_URL, null, {
    params: { adminId, roleId },
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
  });

export const reqDoAssignRole = (roleVo: RoleVo): Promise<ResponseData> =>
  request.post<any, ResponseData>(API.USER_DO_ASSIGN_ROLE_URL, roleVo);
