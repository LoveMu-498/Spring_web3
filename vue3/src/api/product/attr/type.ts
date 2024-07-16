export interface ResponseData {
  code: number;
  data: any;
  message: string;
  ok: boolean;
}

export interface Category1Type {
  id: number;
  name: string;
}

export interface Category2Type extends Category1Type {
  category1Id: number;
}

export interface Category3Type extends Category1Type {
  category2Id: number;
}

export interface AttributeValueType {
  attrId?: number;
  id?: number;
  valueName: string;
  // 每个属性值的编辑模式和显示模式切换 编辑模式true 显示模式 false
  flag?: boolean;
}

export type AttributeValueTypes = Array<AttributeValueType>;

export interface AttributeType {
  id?: number;
  attrName: string;
  categoryId: number;
  categoryLevel: number;
  attrValueList: AttributeValueTypes;
}

export type Category1Types = Array<Category1Type>;
export type Category2Types = Array<Category2Type>;
export type Category3Types = Array<Category3Type>;
export type AttributeTypes = Array<AttributeType>;

export interface Category1ResponseData extends ResponseData {
  data: Category1Types;
}

export interface Category2ResponseData extends ResponseData {
  data: Category2Types;
}

export interface Category3ResponseData extends ResponseData {
  data: Category3Types;
}

export interface AttributeResponseData extends ResponseData {
  data: AttributeTypes;
}
