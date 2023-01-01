import { get, post, put, del, download } from '~/utils/http/axios';
import type { R, PageVo } from '../../types';
import type { SeatBody, SeatSearchBody, SeatVo } from './types';

enum URL {
  list = '/admin/seat/list',
  baseUrl = '/admin/seat/',
  export = '/admin/seat/export'
}

export const seatList = async (seatBody: SeatSearchBody) =>
  get<R<PageVo<SeatVo[]>>>({ url: URL.list, params: seatBody });

export const getSeat = async (seatId: number) =>
  get<R<SeatVo>>({ url: URL.baseUrl + seatId });

export const addSeat = async (seatBody: SeatBody) =>
  post<R<SeatVo>>({ url: URL.baseUrl, data: seatBody });

export const removeSeat = async (seatIds: string) =>
  del<R<String>>({ url: URL.baseUrl + seatIds });

export const editSeat = async (seatBody: SeatBody) =>
  put<R<SeatVo>>({ url: URL.baseUrl, data: seatBody });

export const exportSeat = async (seatBody: SeatSearchBody) =>
  download(URL.export, seatBody, `seat_${new Date().getTime()}.xlsx`);
