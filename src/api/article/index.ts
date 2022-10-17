// 权限问题后期增加
import { get, post } from '~/utils/http/axios';
import type * as Type from './types';

enum URL {
  list = '/article/list'
}

export const fetchList = async (data?: Type.ListRequestParams) =>
  get<Type.ListBaseResponse>({ url: URL.list, params: data });
