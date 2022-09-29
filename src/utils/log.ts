import { useGlobSetting } from '@/hooks/setting';
const globSetting = useGlobSetting();

const projectName = globSetting.title;

export function warn(message: string) {
  console.warn(`[${projectName} warn]:${message}`);
}

export function error(message: string) {
  throw new Error(`[${projectName} error]:${message}`);
}
