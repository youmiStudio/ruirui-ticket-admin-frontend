import { get, post, put, del, download } from '~/utils/http/axios';
import type { R, PageVo } from '../../types';
import type { CarAddAndEditBody, CarSearchBody, CarVo } from './types';

const BASE_URL = '/admin/car';

enum URL {
  list = '/list',
  export = '/export'
}



export const carList = async (body?: CarSearchBody) =>
  get<R<PageVo<CarVo[]>>>({ url: BASE_URL + URL.list, params: body });

export const getCar = async (id: number) =>
  get<R<CarVo>>({ url: BASE_URL + '/' + id });

export const addCar = async (body: CarAddAndEditBody) =>
  post<R<string>>({ url: BASE_URL, data: body });

export const removeCar = async (ids: string) =>
  del<R<string>>({ url: BASE_URL + '/' + ids });

export const editCar = async (body: CarAddAndEditBody) =>
  put<R<string>>({ url: BASE_URL, data: body });

export const exportCar = async (body: CarSearchBody) =>
  download(BASE_URL + URL.export, body, `Car_${new Date().getTime()}.xlsx`);
