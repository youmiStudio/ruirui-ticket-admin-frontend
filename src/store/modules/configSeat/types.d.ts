import type { Seat,ParentSize } from '@/views/business/car/types';

export interface ConfigSeatStoreState {
  seatList: Seat[];
  /**
   * 被删除的座位
   */
  removeSeatIds: number[];
  curParentSize: parentSize
}
