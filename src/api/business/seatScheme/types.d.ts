import { SeatSize, Position } from '@/views/business/seat-scheme/types';

export type SeatSchemePosition = {
  seatSchemePositionId?: number;
  seatSchemeId?: number;
  seatId: number;
  name: string;
  positionData: Position;
  sizeData: SeatSize;
};

export type SeatScheme = {
  seatSchemeId?: number;
  seatSchemeName: string;
  carPlaneImage: string;
  unSelectedIcon: string;
  selectedIcon: string;
  boughtIcon: string;
  status: string;
  positions: SeatSchemePosition[];
};

export type SeatSchemeDTO = SeatScheme;

export type SeatSchemeVO = SeatScheme;