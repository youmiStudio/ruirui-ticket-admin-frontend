import { get, post, put, del, download } from '~/utils/http/axios';
import type { R, PageVo } from '../../types';
import type { OrderVO, OrderPageSearchDTO } from './types';

const BASE_URL = '/admin/order';

enum URL {
  list = '/list',
  export = '/export'
}

export const orderList = async (body?: OrderPageSearchDTO) =>
  get<R<PageVo<OrderVO[]>>>({ url: BASE_URL + URL.list, params: body });
