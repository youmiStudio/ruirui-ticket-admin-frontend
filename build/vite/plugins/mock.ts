import { viteMockServe } from 'vite-plugin-mock';
// import { resolve } from '../../utils';

export function configMock(isBuild?: boolean) {
  const mockPlugin = viteMockServe({
    ignore: /^\_/,
    mockPath: 'mock',
    localEnabled: !isBuild,
    prodEnabled: isBuild,
    injectCode: `
      import { setupProdMockServer } from '../mock/_createProductionServer';

      setupProdMockServer();
      `,
    supportTs: true
  });
  return mockPlugin;
}
