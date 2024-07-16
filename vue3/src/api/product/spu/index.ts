import request from '@/utils/request.ts';
import {
  BaseSaleAttrResponseData,
  ResponseData,
  SpuInfo,
  SpuInfoListResponseData,
  SpuInfoResponseData,
  SpuResponseData,
} from '@/api/product/spu/type.ts';
import * as querystring from 'node:querystring';

// eslint-disable-next-line no-shadow
enum API {
  SPU_URL = '/admin/product',
  SPU_INFO_URL = '/admin/product/getSpuInfo',
  SPU_KEYWORD_URL = '/admin/product/findSpuInfoByKeyword',
  SPU_DELETE_URL = '/admin/product/deleteSpu',
  SPU_SAVE_URL = '/admin/product/saveSpuInfo',
  SPU_UPDATE_URL = '/admin/product/updateSpuInfo',
  BASE_SALE_ATTR_URL = '/admin/product/baseSaleAttrList',
}

export const reqGetSpuList = (
  page: number,
  limit: number,
  spuInfo: SpuInfo
): Promise<SpuResponseData> => {
  console.log(new URLSearchParams(spuInfo).toString());
  return request.get<any, SpuResponseData>(
    `${API.SPU_URL}/${page}/${limit}?${new URLSearchParams(spuInfo).toString()}`
  );
};

export const reqGetSpuInfo = (spuId: number): Promise<SpuInfoResponseData> =>
  request.get<any, SpuInfoResponseData>(`${API.SPU_INFO_URL}/${spuId}`, {});

export const reqGetSpuInfoByKeyword = (keyword: string): Promise<SpuInfoListResponseData> =>
  request.get<any, SpuInfoListResponseData>(`${API.SPU_KEYWORD_URL}/${keyword}`, {});

export const reqDeleteSpu = (spuId: number): Promise<ResponseData> =>
  request.delete<any, ResponseData>(`${API.SPU_DELETE_URL}/${spuId}`, {});

export const reqSaveSpuInfo = (spuInfo: SpuInfo): Promise<ResponseData> =>
  request.post<any, ResponseData>(API.SPU_SAVE_URL, spuInfo);

export const reqUpdateSpuInfo = (spuInfo: SpuInfo): Promise<ResponseData> =>
  request.post<any, ResponseData>(API.SPU_UPDATE_URL, spuInfo);

export const reqAddOrUpdateSpu = (spuInfo: SpuInfo): Promise<ResponseData> => {
  if (spuInfo.id) {
    console.log('update', spuInfo);
    return reqUpdateSpuInfo(spuInfo);
  }
  console.log('save', spuInfo);
  return reqSaveSpuInfo(spuInfo);
};

export const reqBaseSaleAttrList = (): Promise<BaseSaleAttrResponseData> =>
  request.get<any, BaseSaleAttrResponseData>(API.BASE_SALE_ATTR_URL);
