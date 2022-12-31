import { get, post, put, del, download } from '~/utils/http/axios';
import type { R, PageVo } from '../types';

import type { ConfigAddAndEditBody, ConfigSearchBody, ConfigVo } from './types';

const BASE_URL = '/admin/config';

enum URL {
  list = '/list',
  export = '/export',
  refreshCache = '/refreshCache'
}

export const configList = async (body?: ConfigSearchBody) =>
  get<R<PageVo<ConfigVo[]>>>({ url: BASE_URL + URL.list, params: body });

export const getConfig = async (id: number) =>
  get<R<ConfigVo>>({ url: BASE_URL + '/' + id });

export const addConfig = async (body: ConfigAddAndEditBody) =>
  post<R<string>>({ url: BASE_URL, data: body });

export const removeConfig = async (ids: string) =>
  del<R<string>>({ url: BASE_URL + '/' + ids });

export const refreshCacheConfig = async () =>
  del<R<string>>({ url: BASE_URL + URL.refreshCache });

export const editConfig = async (body: ConfigAddAndEditBody) =>
  put<R<string>>({ url: BASE_URL, data: body });

export const exportConfig = async (body: ConfigSearchBody) =>
  download(BASE_URL + URL.export, body, `Config_${new Date().getTime()}.xlsx`);
