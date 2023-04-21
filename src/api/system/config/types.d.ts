import type { BaseSearchBody, BaseVo } from '@/api/types';

/**
 * 参数实体类
 */
export type ConfigVo = {
  /**
   * 参数Id
   */
  configId: number;

  /**
   * 参数名称
   */
  configName: string;

  /**
   * 参数键名
   */
  configKey: string;

  /**
   * 参数键值
   */
  configValue: string;

  /**
   * 系统内置（Y是 N否）
   */
  configType: string;
} & BaseVo;

export type ConfigSearchBody = Partial<
  Pick<ConfigVo, 'configName' | 'configKey' | 'configType'>
> &
  BaseSearchBody;

export type ConfigAddAndEditBody = Partial<
  Pick<
    ConfigVo,
    'configId' | 'configName' | 'configKey' | 'configValue' | 'configType' | 'remark'
  >
>;
