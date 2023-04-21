import { get, post, put, del, download } from '~/utils/http/axios';
import type { R, PageVo } from '../../types';
import { SeatSchemeDTO, SeatSchemeVO, SeatSchemePageSearchDTO } from './types';

enum URL {
  list = '/admin/seatScheme/list',
  baseUrl = '/admin/seatScheme',
  export = '/admin/seatScheme/export'
}

export const seatSchemeList = async (seatBody?: SeatSchemePageSearchDTO) =>
  get<R<PageVo<SeatSchemeVO[]>>>({ url: URL.list, params: seatBody });
export const addSeatScheme = async (data: SeatSchemeDTO) =>
  post<R<string>>({ url: URL.baseUrl, data });
export const editSeatScheme = async (data: SeatSchemeDTO) =>
  put<R<string>>({ url: URL.baseUrl, data });
export const getSeatScheme = async (id: number) =>
  get<R<SeatSchemeVO>>({ url: URL.baseUrl + `/${id}` });
export const removeSeatScheme = async (seatIds: string) =>
  del<R<String>>({ url: URL.baseUrl + `/${seatIds}` });
