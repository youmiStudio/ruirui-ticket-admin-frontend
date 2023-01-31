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
  parentWidth: number;
  parentHeight: number;
  parentScale: number;
};

type ParentSize = {
  scale: number;
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
  carSeatId?: number;
  seatId?: number;
  carId: number;
  size: SeatSize;
  position: SeatPosition;
  dragConfig: DragConfig;
  identity?: string;
} & SeatVoOfCarConfig;
