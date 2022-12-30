// 权限问题后期增加
import { R, PageVo } from '@/api/types';
import { get, post, put, download, del } from '~/utils/http/axios';
import {
  UserInfoRes,
  UserRequestParams,
  UserLoginRes,
  UserSearchBody,
  UserBody,
  UserVo
} from './types';

import {RoleVo} from '../role/types'

const BASE_URL = '/admin/user';

enum URL {
  login = '/login',
  logout = '/logout',
  getInfo = '/info',
  getCaptchaImage = '/admin/captchaImage',
  list = '/list',
  export = '/export',
  resetPwd = '/resetPwd',
  authRole = '/authRole',
  getRouters = '/getRouters'
}

// const getUserProfile = async () => get<UserState>({ url: URL.profile });
export const login = async (data: UserRequestParams) =>
  post<UserLoginRes>({ url: BASE_URL + URL.login, data });

export const logout = async (token: string | undefined | null) =>
  post<UserInfoRes>({ url: BASE_URL + URL.logout, params: { token } });

export const getInfo = async (token: string | undefined | null) =>
  get<UserInfoRes>({ url: BASE_URL + URL.getInfo, params: { token } });

export const getRouters = async () =>
get<R<RouteItem[]>>({ url: BASE_URL + URL.getRouters });

export const getCaptchaImage = async () => get({ url: URL.getCaptchaImage });

export const userList = async (body: UserSearchBody) =>
  get<R<PageVo<UserVo[]>>>({ url: BASE_URL + URL.list, params: body });

export const getUser = async (id: number | string) =>
  get<R<UserVo>>({ url: BASE_URL + '/' + id });

export const getUserAuthRole = async (id: string) =>
  get<R<RoleVo[]>>({ url: BASE_URL + URL.authRole + '/' + id });

export const addUser = async (body: UserBody) =>
  post<R<UserVo>>({ url: BASE_URL, data: body });

export const removeUser = async (ids: string) =>
  del<R<string>>({ url: BASE_URL + '/' + ids });

export const editUser = async (body: UserBody) =>
  put<R<UserVo>>({ url: BASE_URL, data: body });

export const exportUser = async (body: UserSearchBody) =>
  download(BASE_URL + URL.export, body, `user_${new Date().getTime()}.xlsx`);

export const resetPwdUser = async (
  body: Pick<UserBody, 'password' | 'userId'>
) => put<R<string>>({ url: BASE_URL + URL.resetPwd, data: body });
