import { get, post, put, del, download } from '~/utils/http/axios';
import type { R, PageVo } from '../../types';
import type { OnlineUserVo, OnlineUserSearchBody } from './types';

const BASE_URL = '/monitor/online';

enum URL {
  list = '/list'
}

export const onlineUserList = async (body?: OnlineUserSearchBody) =>
  get<R<PageVo<OnlineUserVo[]>>>({ url: BASE_URL + URL.list, params: body });

export const forceLogout = async (id: string) =>
  del<R<string>>({ url: BASE_URL + '/' + id });
