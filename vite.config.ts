import path from 'path';
import { defineConfig, ConfigEnv, UserConfig } from 'vite';

import { loadEnv } from 'vite';
import { wrapperEnv } from './build/utils';
import { createProxy } from './build/vite/proxy';
import { createVitePlugins } from './build/vite/plugins';

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
    plugins: createVitePlugins(viteEnv, isBuild)
  };
});
