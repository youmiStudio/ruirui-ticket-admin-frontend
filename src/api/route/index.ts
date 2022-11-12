// 权限问题后期增加
import { get, post, put, del, download } from '~/utils/http/axios';
import type { R } from '../types';
import { RouteAddBody, RouteEditBody, RouteSearchBody, RouteVo } from './type';

enum URL {
  list = '/admin/route/list',
  baseUrl = '/admin/route/',
  export = '/admin/route/export'
}

export const routeList = async (body: RouteSearchBody) =>
  get<R<RouteVo>>({ url: URL.list, params: body });

export const getSite = async (routeId: number) =>
  get<R<RouteVo>>({ url: URL.baseUrl + routeId });

export const addSite = async (siteBody: RouteAddBody) =>
  post<R<RouteVo>>({ url: URL.baseUrl, data: siteBody });

export const removeSite = async (routeIds: string) =>
  del<R<string>>({ url: URL.baseUrl + routeIds });

export const editSite = async (siteBody: RouteEditBody) =>
  put<R<RouteVo>>({ url: URL.baseUrl, data: siteBody });

export const exportSite = async (siteBody: RouteSearchBody) =>
  download(URL.export, siteBody, `route_${new Date().getTime()}.xlsx`);
