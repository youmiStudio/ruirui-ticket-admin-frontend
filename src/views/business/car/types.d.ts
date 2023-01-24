import { SeatVoOfCarConfig } from '~/api/business/seat/types';

export type Config = {
  /**
   * 初始化-座位图标大小
   */
  iconSize: {
    width: number;
    height: number;
  };
};

type SeatSize = {
  width: number;
  height: number;
};

type SeatPosition = {
  x: number;
  y: number;
};

type DragConfig = {
  axis: string;
};

type CollisionPostion = {
  left: number;
  right: number;
  top: number;
  bottom: number;
};

export type Seat = {
  size: SeatSize;
  position: SeatPosition;
  dragConfig: DragConfig;
} & SeatVoOfCarConfig;
