import AutoImport from 'unplugin-auto-import/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { resolve } from '../../utils';
import IconsResolver from 'unplugin-icons/resolver';

export function configAutoImport(isBuild?: boolean) {
  const autoImportPlugin = AutoImport({
    resolvers: [
      ElementPlusResolver(),
      // Auto import icon components
      // 自动导入图标组件
      IconsResolver({
        prefix: 'Icon'
      })
    ],
    eslintrc: {
      enabled: false, // Default `false`
      filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
      globalsPropValue: true // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
    },
    imports: ['vue', 'vue-router'],
    dts: resolve('types') + '/auto-imports.d.ts',
  });

  return autoImportPlugin;
}
