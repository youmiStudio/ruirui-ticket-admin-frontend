import { get, post, put, del, download } from '~/utils/http/axios';
import type { R, PageVo } from '../types';
import type { SeatBody, SeatVo } from './types';

enum URL {
  list = '/admin/seat/list',
  baseUrl = '/admin/seat/',
  export = '/admin/seat/export'
}

export const seatList = async (seatBody: SeatBody) =>
  get<R<PageVo<SeatVo[]>>>({ url: URL.list, params: seatBody });

export const getSeat = async (seatId: number) =>
  get<R<SeatVo>>({ url: URL.baseUrl + seatId });

export const addSeat = async (seatBody: SeatBody) =>
  post<R<SeatVo>>({ url: URL.baseUrl, data: seatBody });

export const removeSite = async (seatIds: string) =>
  del<R<String>>({ url: URL.baseUrl + seatIds });

export const editSite = async (seatBody: SeatBody) =>
  put<R<SeatVo>>({ url: URL.baseUrl, data: seatBody });

export const exportSite = async (seatBody: SeatBody) =>
  download(URL.export, seatBody, `seat_${new Date().getTime()}.xlsx`);
