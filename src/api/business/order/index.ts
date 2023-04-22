import { get, post, put, del, download } from '~/utils/http/axios';
import type { R, PageVo } from '../../types';
import type { OrderVO, OrderPageSearchDTO } from './types';

const BASE_URL = '/admin/order';

enum URL {
  list = '/list',
  refund = '/refund',
  cancel = '/cancel'
}

export const orderList = async (body?: OrderPageSearchDTO) =>
  get<R<PageVo<OrderVO[]>>>({ url: BASE_URL + URL.list, params: body });
export const getOrder = async (orderNo?: string) =>
  get<R<OrderVO>>({ url: BASE_URL + `/${orderNo}` });
export const cancelOrder = async (orderNo?: string) =>
  post<R<string>>({ url: BASE_URL + URL.cancel +`/${orderNo}` });
export const refundOrder = async (orderNo?: string) =>
  post<R<string>>({ url: BASE_URL + URL.refund +`/${orderNo}` });
