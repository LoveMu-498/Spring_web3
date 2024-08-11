export type ArrayToUnion<T extends readonly any[]> = T[number];

export type TransformType<T, K extends keyof T> = Partial<Omit<T, K>> & Required<Pick<T, K>>;

export type TransformTypes<T, K extends (keyof T)[]> = Partial<Omit<T, K[number]>> &
  Required<Pick<T, K[number]>>;
