import Unocss from 'unocss/vite';
import { PluginOption } from 'vite';

import {
  presetAttributify,
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup
} from 'unocss';

export function configUnocss(isBuild?: boolean) {
  // https://github.com/antfu/unocss
  // see unocss.config.ts for config
  const unocssPlugin = Unocss({
    presets: [
      presetUno(),
      presetAttributify(),
      presetIcons({
        scale: 1.2,
        warn: true
      })
    ],
    transformers: [transformerDirectives(), transformerVariantGroup()]
  }) as PluginOption;

  return unocssPlugin;
}
