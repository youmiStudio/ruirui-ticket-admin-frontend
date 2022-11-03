export type BaseResponse<T> = {
  code: number;
  data?: T;
  msg?: string;
};
