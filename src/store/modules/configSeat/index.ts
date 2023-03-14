import { defineStore } from 'pinia';
import { ConfigSeatStoreState } from './types';
import { useGlobSettings } from '@/hooks/settings/useGlobSettings';
import type { Seat, ParentSize } from '~/views/business/seat-scheme/types';
import {
  carSeatList,
  saveCarSeat,
  removeCarSeat
} from '@/api/business/carSeat';

const globSettings = useGlobSettings();

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
    getSeat(id: number) {
      return new Promise((resolve) => {
        carSeatList(id).then((res) => {
          const { data } = res;
          if (data) {
            data.forEach(item=>{
              ['boughtIcon', 'selectedIcon', 'unSelectedIcon'].forEach((key) => {
                item[key] = globSettings.apiUrl + item[key];
              });
            })
            resolve(data);
            this.seatList = data;
            this.calcSeatXYByCurParentSize();
          }
        });
      });
    },
    addSeat(seat: Seat) {
      this.seatList.push(seat);
    },
    removeSeat(seat: Seat) {
      this.seatList = this.seatList.filter(
        (item) => item.carSeatId !== seat.carSeatId
      );

      if (seat.carSeatId && seat.identity !== 'local') {
        this.removeSeatIds.push(seat.carSeatId);
      }
    },
    setParentSize(parentSize: ParentSize) {
      this.curParentSize = parentSize;
    },
    saveSeat() {
      return new Promise((resolve) => {
        const list = [...this.seatList];
        list.forEach((item) => {
          if (item.carSeatId && item.identity && item.identity === 'local') {
            delete item.carSeatId;
          }

          item.size = Object.assign({}, item.size, {
            parentWidth: this.curParentSize.width,
            parentHeight: this.curParentSize.height,
            parentScale: this.curParentSize.scale
          });
        });

        saveCarSeat(list).then((res) => {
          if (res.code === 200) {
            resolve(true);
          }
        });

        if(this.removeSeatIds.length > 0) {
          removeCarSeat(this.removeSeatIds.join(','))
        }
      });
    },
    resetSeat() {
      this.seatList = []
      this.removeSeatIds = []
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
