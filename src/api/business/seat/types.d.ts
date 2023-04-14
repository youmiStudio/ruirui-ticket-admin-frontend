import { type } from 'os';
import type { BaseSearchBody, BaseVo } from '../../types';

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
  seatId?: number;
  seatName: string;
  seatDescribe?: string;
  price: number | string;
  status?: string;
} & BaseVo;

/**
 * 新增和编辑请求体
 */
export type SeatDTO = SeatVo

export type SeatVoOfCarConfig = Pick<
  SeatVo,
  | 'seatId'
  | 'seatName'
  | 'boughtIcon'
  | 'unSelectedIcon'
  | 'selectedIcon'
  | 'oldPrice'
  | 'price'
>;
