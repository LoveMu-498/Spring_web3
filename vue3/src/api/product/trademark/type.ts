export interface ResponseData {
  code: number;
  data: any;
  message: string;
  ok: boolean;
}

// 已有品牌的数据类型
export interface TradeMark {
  id?: number;
  tmName: string;
  logoUrl: string;
}

// 包含全部品牌数据的ts类型
export type TradeMarkList = Array<TradeMark>;

// 获取的已有全部品牌的数据ts类型
export interface TradeMarkResponseData extends ResponseData {
  data: {
    total: number;
    size: number;
    current: number;
    searchCount: boolean;
    pages: number;
    // countId: null;
    // hitCount: boolean;
    // maxLimit: null;
    // optimizeCountSql: boolean;
    // orders: [];
    records: TradeMarkList;
  };
}

export interface TradeMarkListResponseData extends ResponseData {
  data: TradeMarkList;
}
