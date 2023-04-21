import { get, post, put, del, download } from '~/utils/http/axios';
import type { R, PageVo } from '../../types';
import type { SysCacheVo } from './types';

const BASE_URL = '/monitor/cache';

enum URL {
  getNames = '/getNames',
  getKeys = '/getKeys',
  getValue = '/getValue',
  clearCacheName = '/clearCacheName',
  clearCacheKey = '/clearCacheKey',
  clearCacheAll = '/clearCacheAll'
}

export const getNames = async () =>
  get<R<SysCacheVo[]>>({ url: BASE_URL + URL.getNames });
export const getKeys = async (cacheName: string) =>
  get<R<string[]>>({ url: BASE_URL + URL.getKeys + `/${cacheName}` });
export const getValue = async (cacheName: string, cacheKey: string) =>
  get<R<SysCacheVo>>({
    url: BASE_URL + URL.getValue + `/${cacheName}/${cacheKey}`
  });
export const clearCacheName = async (cacheName: string) =>
  del<R<string>>({
    url: BASE_URL + URL.clearCacheName + `/${cacheName}`
  });
export const clearCacheKey = async (cacheKey: string) =>
  del<R<string>>({
    url: BASE_URL + URL.clearCacheKey + `/${cacheKey}`
  });
export const clearCacheAll = async () =>
  del<R<string>>({
    url: BASE_URL + URL.clearCacheAll
  });
export const cacheInfo = async () => get<R<any>>({ url: BASE_URL });
