// 权限问题后期增加
import { get, post, put, del, download } from '~/utils/http/axios';
import type { R } from '../types';

enum URL {
  list = '/admin/route/list',
  baseUrl = '/admin/route/',
  export = '/admin/route/export'
}

export const routeList = async (body: any) =>
  get({ url: URL.list, params: body });

// export const getSite = async (siteId: number) =>
//   get({ url: URL.baseUrl + siteId });

// export const addSite = async (siteBody: API.SiteVo) =>
//   post({ url: URL.baseUrl, data: siteBody });

// export const removeSite = async (siteIds: string) =>
//   del({ url: URL.baseUrl + siteIds });

// export const editSite = async (siteBody: API.SiteVo) =>
//   put({ url: URL.baseUrl, data: siteBody });

// export const exportSite = async (siteBody: API.SiteBody) =>
//   download(URL.export, siteBody, `site_${new Date().getTime()}.xlsx`);
