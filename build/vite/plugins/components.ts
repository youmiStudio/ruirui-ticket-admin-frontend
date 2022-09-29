import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { resolve } from '../../utils';

export function configVuecomponents(isBuild?: boolean) {
  const vueComponentsPlugin = Components({
    // allow auto load markdown components under `./src/components/`
    extensions: ['vue', 'md'],
    // allow auto import and register components used in markdown
    include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
    resolvers: [
      ElementPlusResolver({
        importStyle: 'sass'
      })
    ],
    dts: resolve('types') + '/components.d.ts'
  });
  return vueComponentsPlugin;
}
