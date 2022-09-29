import path from 'path';
import { defineConfig, ConfigEnv, UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { loadEnv } from 'vite';

import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';

import Unocss from 'unocss/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import { viteMockServe } from 'vite-plugin-mock';

import { wrapperEnv } from './build/utils';
import { createProxy } from './build/vite/proxy';

import {
  presetAttributify,
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup
} from 'unocss';

function resolve(dir: string) {
  return path.join(__dirname, dir);
}

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }: ConfigEnv): UserConfig => {
  const root = process.cwd();
  const env = loadEnv(mode, root);
  const isBuild = command === 'build';

  // The boolean type read by loadEnv is a string. This function can be converted to boolean type
  const viteEnv = wrapperEnv(env);
  const {
    VITE_PUBLIC_PATH,
    VITE_PORT,
    VITE_PROXY,
    VITE_DROP_CONSOLE,
    VITE_GLOB_OUTPUT_DIR
  } = viteEnv;
  console.log(VITE_GLOB_OUTPUT_DIR);

  return {
    base: VITE_PUBLIC_PATH,
    server: {
      https: false,
      // Listening on all local IPs
      host: true,
      port: VITE_PORT,
      // Load proxy configuration from .env
      proxy: createProxy(VITE_PROXY)
    },
    resolve: {
      alias: [
        {
          find: /@\//,
          replacement: resolve('src') + '/'
        },
        {
          find: /~\//,
          replacement: resolve('src') + '/'
        },
        {
          find: /#\//,
          replacement: resolve('types') + '/'
        }
      ]
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "~/styles/element/index.scss" as *;`
        }
      }
    },
    esbuild: {
      pure: VITE_DROP_CONSOLE ? ['console.log', 'debugger'] : []
    },
    build: {
      target: 'es2015',
      cssTarget: 'chrome80',
      outDir: VITE_GLOB_OUTPUT_DIR || 'dist',
      // minify: 'terser',
      /**
       * 当 minify=“minify:'terser'” 解开注释
       * Uncomment when minify="minify:'terser'"
       */
      // terserOptions: {
      //   compress: {
      //     keep_infinity: true,
      //     drop_console: VITE_DROP_CONSOLE,
      //   },
      // },
      // Turning off brotliSize display can slightly reduce packaging time
      brotliSize: false,
      chunkSizeWarningLimit: 2000
    },
    plugins: [
      vue(),
      Components({
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
      }),

      // https://github.com/antfu/unocss
      // see unocss.config.ts for config
      Unocss({
        presets: [
          presetUno(),
          presetAttributify(),
          presetIcons({
            scale: 1.2,
            warn: true
          })
        ],
        transformers: [transformerDirectives(), transformerVariantGroup()]
      }),

      AutoImport({
        resolvers: [ElementPlusResolver()],
        eslintrc: {
          enabled: false, // Default `false`
          filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
          globalsPropValue: true // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
        },
        imports: ['vue', 'vue-router'],
        dts: resolve('types') + '/auto-imports.d.ts'
      }),

      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [resolve('src/icons/svg')],
        // 指定symbolId格式
        symbolId: 'icon-[dir]-[name]',
        svgoOptions: true
      }),

      viteMockServe({
        mockPath: resolve('mock')
      })
    ]
  };
});
