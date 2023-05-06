import { get, post, put, del, download } from '~/utils/http/axios';
import type { R, PageVo } from '../../types';
import { AnalysisSearchDTO, FlowsVO, RealTimeVO,RealTime } from './types';

enum URL {
  BASE = '/admin/analysis',
  REAL_TIME = '/realTime',
  FLOWS = '/flows',
  ORDERS = '/orders'
}

const getUrl = (url?: string) => {
  if (!url) {
    url = '';
  }
  return URL.BASE + url;
};

export const realTime = async () =>
  get<R<RealTimeVO>>({ url: getUrl(URL.REAL_TIME) });

export const flows = async (body: AnalysisSearchDTO) =>
  get<R<Recordable<FlowsVO>>>({ url: getUrl(URL.FLOWS), params: body });


export const orders = async (body: AnalysisSearchDTO) =>
get<R<Recordable<RealTime>>>({ url: getUrl(URL.ORDERS), params: body });
