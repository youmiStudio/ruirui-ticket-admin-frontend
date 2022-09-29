import { useGlobSetting } from '@/hooks/setting';

const globSetting = useGlobSetting();

export default function getPageTitle(pageTitle: unknown): string {
  const { title } = globSetting;
  if (pageTitle) {
    return `${pageTitle} - ${title}`;
  }
  return `${title}`;
}
