export {};

declare global {
  export interface GlobalConfig {
    /**
     *  @description App title
     */
    title: string;
    /**
     *  @description Axios request prefix url
     */
    apiUrl: string;
    /**
     *  @description upload File path
     */
    uploadUrl?: string;
    /**
     *  @description Whether show the settins right-panal
     */
    showSettings: boolean;
    /**
     *  @description Whether need tagsView
     */
    tagsView: boolean;
    /**
     *  @description Whether fix the header
     */
    fixedHeader: boolean;
    /**
     *  @description Whether show the login in sidebar
     */
    sidebarLogo: boolean;

    /**
     * @type {string | array} 'production' | ['production', 'development']
     * @description Need show err logs component.
     * The default is only used in the production env
     * If you want to also use it in dev, you can pass ['production', 'development']
     */
    errorLog?: string;

    websocketUrl?: string;
  }

  interface ViteEnvConfig {
    readonly VITE_PORT: number;

    readonly VITE_USE_MOCK: boolean;

    readonly VITE_PUBLIC_PATH: string;

    readonly VITE_GLOB_APP_TITLE: string;

    readonly VITE_PROXY: [string, string][];

    readonly VITE_DROP_CONSOLE: boolean;

    readonly VITE_GLOB_API_URL: string;

    readonly VITE_GLOB_UPLOAD_URL: string;

    readonly OUTPUT_DIR: string;

    readonly VITE_GLOB_WEBSOCKET_URL: string;
  }
}
