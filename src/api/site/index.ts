// 权限问题后期增加
import { get, post, put, del } from '~/utils/http/axios';
import * as API from './type';

enum URL {
  list = '/admin/site/list',
  baseUrl = '/admin/site/'
}

export const siteList = async (siteBody: API.SiteBody) =>
  get<API.SiteVo>({ url: URL.list, params: siteBody });

export const getSite = async (siteId: number) =>
  get<API.SiteVo>({ url: URL.baseUrl + siteId });

export const addSite = async (siteBody: API.SiteVo) =>
  post<API.SiteVo>({ url: URL.baseUrl, params: siteBody });

export const removeSite = async (siteIds: string) =>
  del<API.SiteVo>({ url: URL.baseUrl + siteIds });

export const editSite = async (siteBody: API.SiteVo) =>
  put<API.SiteVo>({ url: URL.baseUrl, params: siteBody });