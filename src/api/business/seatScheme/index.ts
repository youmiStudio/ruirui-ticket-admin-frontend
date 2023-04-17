import { get, post, put, del, download } from '~/utils/http/axios';
import type { R, PageVo } from '../../types';
import { SeatSchemeDTO, SeatSchemeVO } from './types';

enum URL {
  list = '/admin/seatScheme/list',
  baseUrl = '/admin/seatScheme',
  export = '/admin/seatScheme/export'
}

export const addSeatScheme = async (data: SeatSchemeDTO) =>
  post<R<string>>({ url: URL.baseUrl, data });
export const editSeatScheme = async (data: SeatSchemeDTO) =>
put<R<string>>({ url: URL.baseUrl, data });
export const getSeatScheme = async (id: number) =>
  get<R<SeatSchemeVO>>({ url: URL.baseUrl + `/${id}` });
