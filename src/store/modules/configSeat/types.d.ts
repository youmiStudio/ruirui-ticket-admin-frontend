import type { Seat,ParentSize } from '~/views/business/seat-scheme/types';

export interface ConfigSeatStoreState {
  seatList: Seat[];
  /**
   * 被删除的座位
   */
  removeSeatIds: number[];
  curParentSize: parentSize
}
