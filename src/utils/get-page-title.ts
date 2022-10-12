import { useGlobSettings } from '~/hooks/settings/useGlobSettings';

const globSetting = useGlobSettings();

export default function getPageTitle(pageTitle: unknown): string {
  const { title } = globSetting;
  if (pageTitle) {
    return `${pageTitle} - ${title}`;
  }
  return `${title}`;
}
