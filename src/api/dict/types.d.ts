import type { BaseSearchBody, BaseVo } from '../types';

/**
 * 字典类型 - 请求对象
 */
export type DictTypeSearchBody = {
  /**
   * 字典主键
   */
  dictId?: Number | string;
  /**
   * 字典名称
   */
  dictName?: string;
  /**
   * 字典类型
   */
  dictType?: string;
  /**
   * 字典状态
   */
  status?: string;

  /**
   * 创建时间
   */
  createTime?: string;
} & BaseSearchBody;

/**
 * 新增字典 - 请求体
 */
export type DictTypeBody = Pick<
  DictTypeVo,
  'dictId' | 'dictName' | 'dictType' | 'status' | 'remark'
>;

/**
 * 字典类型 - 返回对象
 */
export type DictTypeVo = {
  /**
   * 字典主键
   */
  dictId: number | string | undefined;
  /**
   * 字典名称
   */
  dictName: string;
  /**
   * 字典类型
   */
  dictType: string;
  /**
   * 字典状态
   */
  status: string;
} & BaseVo;
