import { get, post, put, del, download } from '~/utils/http/axios';
import type { R, PageVo } from '../../types';
import type { CarAddAndEditBody } from './types';
import type { Seat } from '~/views/business/car/types';

const BASE_URL = '/admin/carSeat';

enum URL {
  list = '/list'
}

export const carSeatList = async (id: number) =>
  get<R<Seat[]>>({ url: BASE_URL + URL.list, params: { carId: id } });
export const saveCarSeat = async (body: CarAddAndEditBody[]) =>
  post<R<string>>({ url: BASE_URL, data: body });
export const removeCarSeat = async (ids: string) =>
  del<R<string>>({ url: BASE_URL + '/' + ids });
