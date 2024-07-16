export interface ResponseData {
  code: number;
  data: any;
  message: string;
  ok: boolean;
}

export interface SpuImageType {
  id: number;
  imgName: string;
  imgUrl: string;
  spuId: number;
}

export type SpuImageTypes = Array<SpuImageType>;

export interface SpuPosterType {
  id: number;
  imgName: string;
  imgUrl: string;
  spuId: number;
}

export type SpuPosterTypes = Array<SpuPosterType>;

export interface SpuSaleAttrValue {
  baseSaleAttrId: number;
  id: number;
  isChecked: boolean;
  saleAttrName: string;
  saleAttrValueName: string;
  spuId: number;
}

export type SpuSaleAttrValues = Array<SpuSaleAttrValue>;

export interface SpuSaleAttr {
  baseSaleAttrId: number;
  id: number;
  saleAttrName: string;
  spuId: number;
  newTagFlag?: boolean;
  newTagValue?: string;
  spuSaleAttrValueList: SpuSaleAttrValues;
}

export type SpuSaleAttrs = Array<SpuSaleAttr>;

export interface SpuInfo {
  category3Id: number;
  description: string;
  id: number;
  spuImageList: SpuImageTypes;
  spuName: string;
  spuPosterList: SpuPosterTypes;
  spuSaleAttrList: SpuSaleAttrs;
  tmId: number;
}

export interface SpuInfoResponseData extends ResponseData {
  data: SpuInfo;
}

export type SpuInfoList = Array<SpuInfo>;

export interface SpuInfoListResponseData extends ResponseData {
  data: SpuInfoList;
}

export interface SpuResponseData extends ResponseData {
  data: {
    current: number;
    hitCount: boolean;
    pages: number;
    records: SpuInfoList;
    searchCount: boolean;
    size: number;
    total: number;
  };
}

export interface BaseSaleAttr {
  id: number;
  name: string;
}

export type BaseSaleAttrList = Array<BaseSaleAttr>;

export interface BaseSaleAttrResponseData extends ResponseData {
  data: BaseSaleAttrList;
}
