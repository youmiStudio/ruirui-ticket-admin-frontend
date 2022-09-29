import vue from '@vitejs/plugin-vue';
import { PluginOption } from 'vite';

import { configVuecomponents } from './plugin/components';
import { configUnocss } from './plugin/unocss';
import { configAutoImport } from './plugin/autoImport';
import { configSvgIcons } from './plugin/svgIcons';
import { configMock } from './plugin/mock';

type vitePlugins = PluginOption[] | undefined;

export function createVitePlugins(
  viteEnvConfig: ViteEnvConfig,
  isBuild: boolean
): vitePlugins {
  const vitePlugins: vitePlugins = [
    // have to
    vue()
  ];

  vitePlugins.push(configVuecomponents(isBuild));

  vitePlugins.push(configUnocss(isBuild));

  vitePlugins.push(configAutoImport(isBuild));

  vitePlugins.push(configSvgIcons(isBuild));

  vitePlugins.push(configMock(isBuild));

  return vitePlugins;
}
