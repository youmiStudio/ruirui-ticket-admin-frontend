
import { getAppEnvConfig } from '@/utils/env';

export const useGlobSetting = (): Readonly<GlobalConfig> => {
  const {
    VITE_GLOB_APP_TITLE,
    VITE_GLOB_API_URL,
    VITE_GLOB_UPLOAD_URL,
  } = getAppEnvConfig();

  // Take global configuration
  const glob: Readonly<GlobalConfig> = {
    title: VITE_GLOB_APP_TITLE,
    apiUrl: VITE_GLOB_API_URL,
    uploadUrl: VITE_GLOB_UPLOAD_URL,
  };
  return glob as Readonly<GlobalConfig>;
};
