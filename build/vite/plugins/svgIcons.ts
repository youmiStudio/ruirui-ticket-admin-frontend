import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import { resolve } from '../../utils';

export function configSvgIcons(isBuild?: boolean) {
  const svgIconsPlugin = createSvgIconsPlugin({
    // 指定需要缓存的图标文件夹
    iconDirs: [resolve('src/icons/svg')],
    // 指定symbolId格式
    symbolId: 'icon-[dir]-[name]',
    svgoOptions: true
  });
  return svgIconsPlugin;
}
