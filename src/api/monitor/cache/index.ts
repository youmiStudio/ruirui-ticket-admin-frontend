import { get, post, put, del, download } from '~/utils/http/axios';
import type { R, PageVo } from '../../types';

const BASE_URL = '/monitor/cache';

export const cacheInfo = async () =>
  get<R<any>>({ url: BASE_URL });
