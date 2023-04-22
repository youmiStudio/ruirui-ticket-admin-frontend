import { get, post, put, del, download } from '~/utils/http/axios';
import type { R, PageVo } from '../../types';
import { PassengerDTO, PassengerVO } from './types';

enum URL {
  LIST = '/list',
  BASE_URL = '/admin/passenger',
  ID_CARD = '/idCard',
  PHONE = '/phone',
  INFO = '/info'
}

export const passengerList = async (userId: number) =>
  get<R<PassengerVO[]>>({
    url: URL.BASE_URL + URL.LIST + `/${userId}`
  });

export const getPassenger = async (passengerId: number) =>
  get<R<PassengerVO>>({
    url: URL.BASE_URL + URL.INFO + `/${passengerId}`
  });

export const getPassengerIdCard = async (passengerId: number) =>
  get<R<string>>({
    url: URL.BASE_URL + URL.ID_CARD + `/${passengerId}`
  });

export const getPassengerPhone = async (passengerId: number) =>
  get<R<string>>({
    url: URL.BASE_URL + URL.PHONE + `/${passengerId}`
  });

export const addPassenger = async (body: PassengerDTO) =>
  post<R<string>>({
    url: URL.BASE_URL,
    data: body
  });

export const editPassenger = async (body: PassengerDTO) =>
  put<R<string>>({
    url: URL.BASE_URL,
    data: body
  });

export const deletePssenger = async (passengerId: number) =>
  del<R<string>>({
    url: URL.BASE_URL + `/${passengerId}`
  });
