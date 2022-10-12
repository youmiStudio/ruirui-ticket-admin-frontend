import { useGlobSettings } from '~/hooks/settings/useGlobSettings';
const globSetting = useGlobSettings();

const projectName = globSetting.title;

export function warn(message: string) {
  console.warn(`[${projectName} warn]:${message}`);
}

export function error(message: string) {
  throw new Error(`[${projectName} error]:${message}`);
}
