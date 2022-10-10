import Icons from 'unplugin-icons/vite'

export function configIcons(isBuild?: boolean) {
  const autoIconsPlugin = Icons({
    autoInstall: true,
  });

  return autoIconsPlugin;
}