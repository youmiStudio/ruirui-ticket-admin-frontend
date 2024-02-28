import { get, post, put, del, download } from '~/utils/http/axios';
import type { R, PageVo } from '../../types';
import type {
  OrderVO,
  OrderPageSearchDTO,
  OrderItem,
  OrderItemPageSearchDTO
} from './types';

const BASE_URL = '/admin/order';

enum URL {
  list = '/list',
  itemDetailList = '/item/detail',
  itemPageList = '/item/list',
  refund = '/refund',
  cancel = '/cancel',
  itemReceipt = '/item/receipt',
  itemRefund = '/item/refund'
}

export const orderList = async (body?: OrderPageSearchDTO) =>
  get<R<PageVo<OrderVO[]>>>({ url: BASE_URL + URL.list, params: body });

export const orderItemList = async (orderNo?: string) =>
  get<R<PageVo<OrderItem[]>>>({ url: BASE_URL + URL.itemDetailList + `/${orderNo}` });

export const orderItemPageList = async (body?: OrderItemPageSearchDTO) =>
  get<R<PageVo<OrderItem[]>>>({ url: BASE_URL + URL.itemPageList, params: body });

export const getOrder = async (orderNo?: string) =>
  get<R<OrderVO>>({ url: BASE_URL + `/${orderNo}` });
export const cancelOrder = async (orderNo?: string) =>
  post<R<string>>({ url: BASE_URL + URL.cancel + `/${orderNo}` });
export const refundOrder = async (orderNo?: string) =>
  post<R<string>>({ url: BASE_URL + URL.refund + `/${orderNo}` });
export const receiptOrderItem = async (body?: {
  orderNo: string;
  orderItemId: number;
}) => post<R<string>>({ url: BASE_URL + URL.itemReceipt, data: body });
export const refundOrderItem = async (body?: {
  orderNo: string;
  orderItemId: number;
}) => post<R<string>>({ url: BASE_URL + URL.itemRefund, data: body });
