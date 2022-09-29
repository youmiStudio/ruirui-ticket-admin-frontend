declare global {
    declare type ApiResult<T> = {
      code: number;
      data: T;
    };
  }
  
  export {};
  