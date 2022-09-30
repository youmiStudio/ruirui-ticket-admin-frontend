declare global {
  declare interface AppStoreState {
    /**
     * layouts defalut风格，侧边栏配置
     */
    sidebar: {
      /**
       * 是否打开？
       */
      opened: boolean;
      /**
       * 关闭动画？
       */
      withoutAnimation: boolean;
    };
    /**
     * 用户浏览网站，使用的设备
     */
    device: string;
  }
}

export {};
