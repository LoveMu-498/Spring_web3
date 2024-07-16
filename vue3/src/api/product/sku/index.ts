import request from '@/utils/request.ts';
import { ResponseData, SkuInfo, SkuResponseData } from '@/api/product/sku/type.ts';

enum API {
  SKU_LIST_URL = '/admin/product/list',
  SKU_SAVE_URL = '/admin/product/saveSkuInfo',
  SPU_ATTR_LIST_URL = '/admin/product/spuSaleAttrList',
  SPU_IMG_LIST_URL = '/admin/product/spuImageList',
  SKU_ON_SALE_URL = '/admin/product/onSale',
  SKU_CANCEL_SALE_URL = '/admin/product/cancelSale',
}

export const reqSkuInfoList = (pageNo: number, limit: number): Promise<SkuResponseData> =>
  request.get<any, SkuResponseData>(`${API.SKU_LIST_URL}/${pageNo}/${limit}`);

export const reqSaveSkuInfo = (skuInfo: SkuInfo): Promise<ResponseData> =>
  request.post<any, ResponseData>(API.SKU_SAVE_URL, skuInfo);

export const reqSpuSaleAttrList = (spuId: number): Promise<ResponseData> =>
  request.get<any, ResponseData>(`${API.SPU_ATTR_LIST_URL}/${spuId}`);

export const reqSpuImageList = (spuId: number): Promise<ResponseData> =>
  request.get<any, ResponseData>(`${API.SPU_IMG_LIST_URL}/${spuId}`);

export const reqOnSale = (skuId: number): Promise<ResponseData> =>
  request.get<any, ResponseData>(`${API.SKU_ON_SALE_URL}/${skuId}`);

export const reqCancelSale = (skuId: number): Promise<ResponseData> =>
  request.get<any, ResponseData>(`${API.SKU_CANCEL_SALE_URL}/${skuId}`);
