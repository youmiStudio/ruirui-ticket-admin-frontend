import { get, post, put, del, download } from '~/utils/http/axios';
import type { R, PageVo } from '../../types';
import { RealTimeVO } from './types';

enum URL {
  BASE = '/admin/analysis',
  REAL_TIME = '/realTime'
}


const getUrl = (url?: string) => {
  if (!url) {
      url = ''
  }
  return URL.BASE + url
};


export const realTime = async () =>
  get<R<RealTimeVO>>({ url: getUrl(URL.REAL_TIME) });
