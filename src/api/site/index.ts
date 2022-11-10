// 权限问题后期增加
import { get, post, put, del } from '~/utils/http/axios';
import { R } from '../types';
import * as API from './type';

enum URL {
  list = '/admin/site/list',
  baseUrl = '/admin/site/'
}

export const siteList = async (siteBody: API.SiteBody) =>
  get({ url: URL.list, params: siteBody });

export const getSite = async (siteId: number) =>
  get({ url: URL.baseUrl + siteId });

export const addSite = async (siteBody: API.SiteVo) =>
  post({ url: URL.baseUrl, data: siteBody });

export const removeSite = async (siteIds: string) =>
  del({ url: URL.baseUrl + siteIds });

export const editSite = async (siteBody: API.SiteVo) =>
  put({ url: URL.baseUrl, params: siteBody });
