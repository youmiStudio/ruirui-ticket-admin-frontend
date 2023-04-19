// 权限问题后期增加
import { get, post, put, del, download } from '~/utils/http/axios';
import type { R, PageVo } from '../../types';
import type { RouteDTO, RouteSearchBody, RouteVo } from './types';

enum URL {
  list = '/admin/route/list',
  baseUrl = '/admin/route/',
  export = '/admin/route/export'
}

export const routeList = async (body: RouteSearchBody) =>
  get<R<PageVo<RouteVo>>>({ url: URL.list, params: body });

export const getRoute = async (routeId: number) =>
  get<R<RouteVo>>({ url: URL.baseUrl + routeId });

export const addRoute = async (siteBody: RouteDTO) =>
  post<R<{routeId:number}>>({ url: URL.baseUrl, data: siteBody });

export const removeRoute = async (routeIds: string) =>
  del<R<string>>({ url: URL.baseUrl + routeIds });

export const editRoute = async (siteBody: RouteDTO) =>
  put<R<any>>({ url: URL.baseUrl, data: siteBody });

export const exportRoute = async (siteBody: RouteSearchBody) =>
  download(URL.export, siteBody, `route_${new Date().getTime()}.xlsx`);
