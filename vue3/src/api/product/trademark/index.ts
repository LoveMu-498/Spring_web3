import request from '@/utils/request.ts';
import { ResponseData, TradeMark, TradeMarkResponseData } from '@/api/product/trademark/type.ts';

// eslint-disable-next-line no-shadow
enum API {
  // 获取已有品牌接口
  TRADEMARK_URL = '/admin/product/baseTrademark',
  TRADEMARK_SAVE_URL = '/admin/product/baseTrademark/save',
  TRADEMARK_UPDATE_URL = '/admin/product/baseTrademark/update',
  TRADEMARK_REMOVE_URL = '/admin/product/baseTrademark/remove',
}

/**
 * 获取已有品牌接口方法
 * @param page 获取第几页, 默认第一页
 * @param limit 获取几个已有品牌的数据
 * */
// eslint-disable-next-line import/prefer-default-export
export const reqHasTrademark = (page: number, limit: number): Promise<TradeMarkResponseData> =>
  request.get<any, TradeMarkResponseData>(`${API.TRADEMARK_URL}/${page}/${limit}`, {});

/**
 * 新增存储品牌方法(POST)
 * */
export const reqAddTrademark = (data: TradeMark): Promise<ResponseData> =>
  request.post<any, ResponseData>(API.TRADEMARK_SAVE_URL, data);

/**
 * 新增修改品牌方法(POST)
 * */
export const reqUpdateTrademark = (data: TradeMark): Promise<ResponseData> =>
  request.put<any, ResponseData>(API.TRADEMARK_UPDATE_URL, data);

export const reqAddOrUpdateTrademark = (data: TradeMark): Promise<ResponseData> => {
  if (data.id) {
    return reqUpdateTrademark(data);
  }
  return reqAddTrademark(data);
};
/**
 * 新增删除品牌方法(DELETE)
 * */
export const reqRemoveTrademark = (id: number): Promise<ResponseData> =>
  request.delete<any, ResponseData>(`${API.TRADEMARK_REMOVE_URL}/${id}`, {});
