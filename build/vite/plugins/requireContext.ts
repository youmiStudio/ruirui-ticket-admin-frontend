import ViteRequireContext from '@originjs/vite-plugin-require-context'

export function configViteRequireContext(isBuild?: boolean) {
  const viteRequireContextPlugin = ViteRequireContext();
  return viteRequireContextPlugin;
}
