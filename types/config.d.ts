export {};

declare global {
  export interface GlobalConfig {
    // Site title
    title: string;
    // Service interface url
    apiUrl: string;
    // Upload url
    uploadUrl?: string;
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
  }
}
