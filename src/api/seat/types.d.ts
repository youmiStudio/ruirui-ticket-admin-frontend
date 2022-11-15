import type { BaseSearchBody, BaseVo } from '../types';

/**
 * 查询座位请求体
 */
export type SeatSearchBody = {
  /**
   * 座位名称
   */
  seatName: string;

  /**
   * 座位状态
   */
  status: string;

  /**
   * 价格区间 - 最少
   */
  minPrice: string;
  /**
   * 价格区间 - 最多
   */
  maxPrice: string;
} & BaseSearchBody;

/**
 * 座位信息信息
 */
export type SeatVo = {
  /**
   * 座位Id
   */
  seatId?: number;
  /**
   * 座位名称
   */
  seatName: string;
  /**
   * 座位描述
   */
  seatDescribe: string;
  /**
   * 座位价格（分）
   */
  price: number | string;
  /**
   * 原座位价格（分）
   */
  oldPrice: number | string;
  /**
   * 未选座位 - 图标url
   */
  unSelectedIcon: string;
  /**
   * 已选座位 - 图标url
   */
  selectedIcon: string;
  /**
   * 已购买座位 - 图标url
   */
  boughtIcon: string;
  /**
   * 座位状态
   */
  status: string;
} & BaseVo;

/**
 * 新增和编辑请求体
 */
export type SeatBody = Pick<
  SeatVo,
  | 'seatId'
  | 'seatName'
  | 'seatDescribe'
  | 'price'
  | 'oldPrice'
  | 'unSelectedIcon'
  | 'selectedIcon'
  | 'boughtIcon'
  | 'status'
  | 'remark'
>;
