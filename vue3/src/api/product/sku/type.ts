export interface ResponseData {
  code: number;
  data: any;
  message: string;
  ok: boolean;
}

export interface SkuImageType {
  id: number;
  imgName: string;
  imgUrl: string;
  isDefault: boolean;
  skuId: number;
  spuImgId: number;
}

export type SkuImageTypes = Array<SkuImageType>;

export interface SkuAttrValueType {
  attrId: number;
  attrName: string;
  id: number;
  skuId: number;
  valueId: number;
  valueName: string;
}

export type SkuAttrValueTypes = Array<SkuAttrValueType>;

export interface SkuSaleAttrValueType {
  id: number;
  saleAttrId: number;
  saleAttrName: string;
  saleAttrValueId: number;
  saleAttrValueName: string;
  skuId: number;
  spuId: number;
}

export type SkuSaleAttrValueTypes = Array<SkuSaleAttrValueType>;

export interface SkuInfo {
  id?: number;
  spuId: number;
  price: number;
  skuName: string;
  skuDesc: string;
  weight: number;
  tmId: number;
  category3Id: number;
  skuDefaultImg: string;
  isSale: number;
  skuImageList: SkuImageTypes;
  skuAttrValueList: SkuAttrValueTypes;
  skuSaleAttrValueList: SkuSaleAttrValueTypes;
}

export type SkuInfoList = Array<SkuInfo>;

export interface SkuResponseData extends ResponseData {
  data: {
    records: SkuInfoList;
    total: number;
    size: number;
    current: number;
    orders: [];
    optimizeCountSql: boolean;
    hitCount: boolean;
    countId: number;
    maxLimit: null;
    searchCount: boolean;
  };
}
