import { defineStore } from 'pinia';
import { ConfigSeatStoreState } from './types';
import { nanoid } from 'nanoid';
import type { Seat } from '@/views/business/car/types';

export const useConfigSeatStore = defineStore({
  id: 'configSeat',
  state: (): ConfigSeatStoreState => ({
    seatList: [],
    removeSeatIds: []
  }),
  getters: {},
  actions: {
    addSeat(seat: Seat) {
      seat.nanoid = nanoid();
      this.seatList.push(seat);
    },
    removeSeat(seat: Seat) {
      this.seatList = this.seatList.filter(
        (item) => item.nanoid !== seat.nanoid
      );

      if (seat.seatId) {
        this.removeSeatIds.push(seat.seatId);
      }
    }
  }
});
