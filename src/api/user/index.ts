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

const BASE_URL = '/admin/user';

enum URL {
  login = '/login',
  logout = '/logout',
  getInfo = '/info',
  getCaptchaImage = '/admin/captchaImage',
  list = '/list',
  export = '/export'
}

// const getUserProfile = async () => get<UserState>({ url: URL.profile });
export const login = async (data: UserRequestParams) =>
  post<UserLoginRes>({ url: BASE_URL + URL.login, data });

export const logout = async (token: string | undefined | null) =>
  post<UserInfoRes>({ url: BASE_URL + URL.logout, params: { token } });

export const getInfo = async (token: string | undefined | null) =>
  get<UserInfoRes>({ url: BASE_URL + URL.getInfo, params: { token } });

export const getCaptchaImage = async () => get({ url: URL.getCaptchaImage });



export const userList = async (body: UserSearchBody) =>
  get<R<PageVo<UserVo[]>>>({ url: BASE_URL + URL.list, params: body });

export const getUser = async (id: number) =>
  get<R<UserVo>>({ url: BASE_URL + id });

export const addUser = async (body: UserBody) =>
  post<R<UserVo>>({ url: BASE_URL, data: body });

export const removeUser = async (ids: string) =>
  del<R<String>>({ url: BASE_URL + ids });

export const editUser = async (body: UserBody) =>
  put<R<UserVo>>({ url: BASE_URL, data: body });

export const exportUser = async (body: UserSearchBody) =>
  download(URL.export, body, `user_${new Date().getTime()}.xlsx`);
