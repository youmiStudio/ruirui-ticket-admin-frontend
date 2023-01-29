import type { Seat } from '@/views/business/car/types';

export interface ConfigSeatStoreState {
  seatList: Seat[];
  /**
   * 被删除的座位
   */
  removeSeatIds: number[];
}
