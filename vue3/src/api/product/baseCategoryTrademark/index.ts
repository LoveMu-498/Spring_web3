import request from '@/utils/request.ts';
import { ResponseData, TradeMarkListResponseData } from '@/api/product/trademark/type.ts';

enum API {
  TRADEMARK_CURRENT_LIST_URL = '/admin/product/baseCategoryTrademark/findCurrentTrademarkList',
  TRADEMARK_LIST_URL = '/admin/product/baseCategoryTrademark/findTrademarkList',
}

export const reqFindCurrentTrademarkList = (
  category3Id: number
): Promise<TradeMarkListResponseData> =>
  request.get<any, TradeMarkListResponseData>(
    `${API.TRADEMARK_CURRENT_LIST_URL}/${category3Id}`,
    {}
  );

export const reqFindTrademarkList = (category3Id: number): Promise<TradeMarkListResponseData> =>
  request.get<any, TradeMarkListResponseData>(`${API.TRADEMARK_LIST_URL}/${category3Id}`);
