// 权限问题后期增加
import { get, post, put, del, download } from '~/utils/http/axios';
import type { R, PageVo } from '../../types';
import type { SiteBody, SiteVo } from './types';

enum URL {
  list = '/admin/site/list',
  baseUrl = '/admin/site/',
  export = '/admin/site/export',
  wxList = 'wx/site/list'
}

export const siteList = async (siteBody: SiteBody) =>
  get<R<PageVo<SiteVo[]>>>({ url: URL.list, params: siteBody });

export const wxSiteList = async () =>
  get<R<SiteVo[]>>({ url: URL.wxList });

export const getSite = async (siteId: number) =>
  get<R<SiteVo>>({ url: URL.baseUrl + siteId });

export const addSite = async (siteBody: SiteVo) =>
  post<R<SiteVo>>({ url: URL.baseUrl, data: siteBody });

export const removeSite = async (siteIds: string) =>
  del<R<String>>({ url: URL.baseUrl + siteIds });

export const editSite = async (siteBody: SiteVo) =>
  put<R<SiteVo>>({ url: URL.baseUrl, data: siteBody });

export const exportSite = async (siteBody: SiteBody) =>
  download(URL.export, siteBody, `site_${new Date().getTime()}.xlsx`);
