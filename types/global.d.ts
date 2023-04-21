export {};

declare global {
  declare type Recordable<T = any> = Record<string, T>;
  declare interface Fn<T = any, R = T> {
    (...arg: T[]): R;
  }
  export type TimeoutHandle = ReturnType<typeof global.setTimeout>;
}

