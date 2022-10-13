export type BaseResponse<T> = {
  code: number;
  data: T;
}