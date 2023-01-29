import { defineStore } from 'pinia';
import { ConfigSeatStoreState } from './types';
import type { Seat, ParentSize } from '@/views/business/car/types';

export const useConfigSeatStore = defineStore({
  id: 'configSeat',
  state: (): ConfigSeatStoreState => ({
    curParentSize: {
      scale: 1,
      width: -1,
      height: -1
    },
    seatList: [],
    removeSeatIds: []
  }),
  getters: {},
  actions: {
    getSeat() {
      setTimeout(() => {
        this.seatList = [
          {
            carSeatId: 10,
            seatId: 106,
            seatName: '二等座',
            unSelectedIcon:
              '/dev-api/profile/upload/2023/01/18/selectedSeat_20230118215532A001.png',
            selectedIcon:
              '/dev-api/profile/upload/2023/01/18/selectedSeat_20230118215534A002.png',
            boughtIcon:
              '/dev-api/profile/upload/2023/01/18/selectedSeat_20230118215536A003.png',
            price: 7000,
            oldPrice: 0,
            position: { x: 297, y: 391 },
            dragConfig: { axis: 'both' },
            size: {
              width: 50,
              height: 50,
              parentScale: 0.6908196721311475,
              parentWidth: 1204,
              parentHeight: 680
            }
          },
          {
            carSeatId: 11,
            seatId: 105,
            seatName: '一等座',
            unSelectedIcon:
              '/dev-api/profile/upload/2023/01/17/unSelectedSeat_20230117204337A001.png',
            selectedIcon:
              '/dev-api/profile/upload/2023/01/17/selectedSeat_20230117204341A002.png',
            boughtIcon:
              '/dev-api/profile/upload/2023/01/17/boughtSeat_20230117204343A003.png',
            price: 9000,
            oldPrice: 0,
            position: { x: 443, y: 208 },
            dragConfig: { axis: 'both' },
            size: {
              width: 75,
              height: 75,
              parentScale: 0.6908196721311475,
              parentWidth: 1204,
              parentHeight: 680
            }
          },
          {
            carSeatId: 12,
            seatId: 105,
            seatName: '一等座',
            unSelectedIcon:
              '/dev-api/profile/upload/2023/01/17/unSelectedSeat_20230117204337A001.png',
            selectedIcon:
              '/dev-api/profile/upload/2023/01/17/selectedSeat_20230117204341A002.png',
            boughtIcon:
              '/dev-api/profile/upload/2023/01/17/boughtSeat_20230117204343A003.png',
            price: 9000,
            oldPrice: 0,
            position: { x: 743, y: 253 },
            dragConfig: { axis: 'both' },
            size: {
              width: 62,
              height: 62,
              parentScale: 0.5932786885245901,
              parentWidth: 1034,
              parentHeight: 584.406
            }
          }
        ];
        this.calcSeatXYByCurParentSize();
      }, 500);
    },
    addSeat(seat: Seat) {
      this.seatList.push(seat);
    },
    removeSeat(seat: Seat) {
      this.seatList = this.seatList.filter(
        (item) => item.carSeatId !== seat.carSeatId
      );

      if (seat.carSeatId) {
        this.removeSeatIds.push(seat.carSeatId);
      }
    },
    setParentSize(parentSize: ParentSize) {
      this.curParentSize = parentSize;
    },
    /**
     * 根据当前的父亲尺寸，计算出新的X，Y
     */
    calcSeatXYByCurParentSize() {
      const { width: cpw, height: cph } = this.curParentSize;
      this.seatList.forEach((seat) => {
        const { parentWidth: pw, parentHeight: ph } = seat.size;
        // console.log(`width: ${cpw} height:${cph} pw: ${pw} ph: ${ph}`);

        const wScale = cpw / pw;

        seat.size.width *= wScale;
        seat.size.height *= wScale;
        seat.position.x *= wScale;
        seat.position.y *= wScale;
      });
    }
  }
});
