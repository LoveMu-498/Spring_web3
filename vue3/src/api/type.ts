export interface ResponseData {
  code: number;
  message: string;
  data: any;
  ok: boolean;
}

export type ArrayAble<T> = T | T[];
