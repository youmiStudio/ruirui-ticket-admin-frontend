import type { BaseSearchBody, BaseVo } from '../../types';

/**
 * 字典数据 - 请求对象
 */
export type DictDataSearchBody = {
  /**
   * 字典编码
   */
  dictCode?: Number | string;
  /**
   * 字典排序
   */
  dictSort?: Number | string;
  /**
   * 字典标签
   */
  dictLabel?: string;
  /**
   * 字典键值
   */
  dictValue?: string;
  /**
   * 字典类型
   */
  dictType?: string;
  /**
   * 样式属性
   */
  cssClass?: string;
  /**
   * 表格回显样式
   */
  listClass?: string;
  /**
   * 是否默认(Y是 N否)
   */
  isDefault?: string;
  /**
   * 字典状态
   */
  status?: string;
} & BaseSearchBody;

/**
 * 新增字典 - 请求体
 */
export type DictDataBody = Partial<DictDataVo>;

/**
 * 字典信息 - 返回对象
 */
export type DictDataVo = {
  /**
   * 字典编码
   */
  dictCode?: number | string;
  /**
   * 字典排序
   */
  dictSort?: number;
  /**
   * 字典标签
   */
  dictLabel?: string;
  /**
   * 字典键值
   */
  dictValue?: string;
  /**
   * 字典类型
   */
  dictType?: string;
  /**
   * 样式属性
   */
  cssClass?: string;
  /**
   * 表格回显样式
   */
  listClass?: string;
  /**
   * 是否默认(Y是 N否)
   */
  isDefault?: string;
  /**
   * 字典状态
   */
  status?: string;

  default: boolean;

  isDefault: string;
} & BaseVo;
