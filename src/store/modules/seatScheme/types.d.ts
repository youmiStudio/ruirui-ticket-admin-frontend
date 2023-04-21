import type { SeatVo } from '@/api/business/seat/types';
import type {
  Seat,
  ParentSize,
  SeatIconItems,
  SeatPosition
} from '~/views/business/seat-scheme/types';

export interface ConfigSeatStoreState {
  seatSchemeId?:number,
  seatTypeList: SeatVo[];
  seatIconList: SeatIconItems[];
  carPlaneImage: string;
  // 提交时要删除的图片地址
  deleteImageFileName: string[];
  seatSchemeName: string;
  positionList: SeatPosition[];
  currentParentSize: ParentSize;
}
