declare global {
  declare interface AppStoreState {
    /**
     * layouts defalut风格，侧边栏配置
     */
    sidebar: {
      /**
       * 下次浏览网站时，侧边栏是否自动打开？
       */
      opened: boolean;
      /**
       * 是否关闭侧边栏动画效果？
       */
      withoutAnimation: boolean;
    };
    /**
     * 用户浏览网站，所使用的设备
     */
    device: string;
  }
}

export {};
