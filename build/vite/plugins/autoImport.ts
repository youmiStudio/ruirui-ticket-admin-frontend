import AutoImport from 'unplugin-auto-import/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { resolve } from '../../utils';

export function configAutoImport(isBuild?: boolean) {
  const autoImportPlugin = AutoImport({
    resolvers: [ElementPlusResolver()],
    eslintrc: {
      enabled: false, // Default `false`
      filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
      globalsPropValue: true // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
    },
    imports: ['vue', 'vue-router'],
    dts: resolve('types') + '/auto-imports.d.ts'
  });
  
  return autoImportPlugin;
}
