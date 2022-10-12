import { getAppEnvConfig } from '@/utils/env';
import defaultSettings from '@/settings';

const { showSettings, tagsView, fixedHeader, sidebarLogo } = defaultSettings;

export const useGlobSettings = (): Readonly<GlobalConfig> => {
  const { VITE_GLOB_APP_TITLE, VITE_GLOB_API_URL, VITE_GLOB_UPLOAD_URL } =
    getAppEnvConfig();

  // Take global configuration
  const glob: Readonly<GlobalConfig> = {
    title: VITE_GLOB_APP_TITLE,
    apiUrl: VITE_GLOB_API_URL,
    uploadUrl: VITE_GLOB_UPLOAD_URL,
    showSettings,
    tagsView,
    fixedHeader,
    sidebarLogo
  };
  return glob as Readonly<GlobalConfig>;
};
