import { useGlobSettings } from '~/hooks/settings';

const globSetting = useGlobSettings();

export default function getPageTitle(pageTitle: unknown): string {
  const { title } = globSetting;
  if (pageTitle) {
    return `${pageTitle} - ${title}`;
  }
  return `${title}`;
}
