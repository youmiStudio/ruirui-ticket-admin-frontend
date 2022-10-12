import vue from '@vitejs/plugin-vue';
import { PluginOption } from 'vite';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vueSetupExtend from 'vite-plugin-vue-setup-extend'

import { configVuecomponents } from './components';
import { configUnocss } from './unocss';
import { configAutoImport } from './autoImport';
import { configSvgIcons } from './svgIcons';
import { configIcons } from './icons';
import { configMock } from './mock';

type vitePlugins = PluginOption[] | undefined;

export function createVitePlugins(
  viteEnvConfig: ViteEnvConfig,
  isBuild: boolean
): vitePlugins {
  const { VITE_USE_MOCK } = viteEnvConfig;

  const vitePlugins: vitePlugins = [
    // have to
    vue(),
    vueJsx(),
    vueSetupExtend()
  ];

  vitePlugins.push(configVuecomponents(isBuild));

  vitePlugins.push(configUnocss(isBuild));

  vitePlugins.push(configAutoImport(isBuild));

  vitePlugins.push(configSvgIcons(isBuild));

  VITE_USE_MOCK && vitePlugins.push(configMock(isBuild));

  vitePlugins.push(configIcons(isBuild));

  return vitePlugins;
}
