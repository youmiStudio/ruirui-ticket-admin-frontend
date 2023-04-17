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

type Position = {
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

export type SeatPosition = {
  seatSchemePositionId?: number | string;
  name: string;
  seatId: number;
  price?: number;
  positionData: Position;
  size: SeatSize;
  firstPositionData?: Position;
  firstSize?: SeatSize;
};

export type SeatIconItems = {
  label: string;
  prop: 'unSelectedIcon' | 'selectedIcon' | 'boughtIcon';
  value: string;
};
