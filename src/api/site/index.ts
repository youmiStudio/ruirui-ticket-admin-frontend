// 权限问题后期增加
import { get, post, put, del, download } from '~/utils/http/axios';
import { R } from '../types';
import * as API from './type';

enum URL {
  list = '/admin/site/list',
  baseUrl = '/admin/site/',
  export = '/admin/site/export',
  wxList = 'wx/site/list'
}

export const siteList = async (siteBody: API.SiteBody) =>
  get<R<API.SiteVo[]>>({ url: URL.list, params: siteBody });

export const wxSiteList = async () =>
  get<R<API.SiteVo[]>>({ url: URL.list });

export const getSite = async (siteId: number) =>
  get<R<API.SiteVo>>({ url: URL.baseUrl + siteId });

export const addSite = async (siteBody: API.SiteVo) =>
  post<R<API.SiteVo>>({ url: URL.baseUrl, data: siteBody });

export const removeSite = async (siteIds: string) =>
  del<R<String>>({ url: URL.baseUrl + siteIds });

export const editSite = async (siteBody: API.SiteVo) =>
  put<R<API.SiteVo>>({ url: URL.baseUrl, data: siteBody });

export const exportSite = async (siteBody: API.SiteBody) =>
  download(URL.export, siteBody, `site_${new Date().getTime()}.xlsx`);
