import request from '@/utils/request.ts';
import {
  AttributeResponseData,
  AttributeType,
  Category1ResponseData,
  Category2ResponseData,
  Category3ResponseData,
  Category3Types,
  ResponseData,
} from '@/api/product/attr/type.ts';

// eslint-disable-next-line no-shadow
enum API {
  CATEGORY1_URL = '/admin/product/getCategory1',
  CATEGORY2_URL = '/admin/product/getCategory2',
  CATEGORY3_URL = '/admin/product/getCategory3',
  ATTRIBUTE_URL = '/admin/product/attrInfoList',
  ATTR_DELETE_URL = '/admin/product/deleteAttr',
  ATTR_GET_URL = '/admin/product/getAttrValueList',
  ATTR_SAVE_URL = '/admin/product/saveAttrInfo',
  CATEGORY3_LIST_URL = '/admin/product/inner/findBaseCategory3ByCategory3IdList',
}

export const reqGetCategory1 = (): Promise<Category1ResponseData> =>
  request.get<any, Category1ResponseData>(API.CATEGORY1_URL, {});

export const reqGetCategory2 = (category2Id: number): Promise<Category2ResponseData> =>
  request.get<any, Category2ResponseData>(`${API.CATEGORY2_URL}/${category2Id}`, {});

export const reqGetCategory3 = (category3Id: number): Promise<Category3ResponseData> =>
  request.get<any, Category3ResponseData>(`${API.CATEGORY3_URL}/${category3Id}`, {});

export const reqGetAttribute = (
  category1Id: number,
  category2Id: number,
  category3Id: number
): Promise<AttributeResponseData> => {
  console.log(category1Id, category2Id, category3Id);
  return request.get<any, AttributeResponseData>(
    `${API.ATTRIBUTE_URL}/${category1Id}/${category2Id}/${category3Id}`,
    {}
  );
};

export const reqDeleteAttrByAttrId = (attrId: number): Promise<ResponseData> =>
  request.delete<any, ResponseData>(`${API.ATTR_DELETE_URL}/${attrId}`, {});

export const reqGetAttrByAttrId = (attrId: number): Promise<ResponseData> =>
  request.get<any, ResponseData>(`${API.ATTR_GET_URL}/${attrId}`, {});

export const reqSaveAttrInfo = (attrInfo: AttributeType): Promise<ResponseData> =>
  request.post<any, ResponseData>(API.ATTR_SAVE_URL, attrInfo);

export const reqFindCategory3ByCategory3IdList = (
  category3IdList: Array<number>
): Promise<Category3Types> =>
  request.post<any, Category3Types>(API.CATEGORY3_LIST_URL, category3IdList);
