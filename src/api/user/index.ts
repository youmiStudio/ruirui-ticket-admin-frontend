// 权限问题后期增加
import { get, post } from '~/utils/http/axios';
import type * as Type from './types';

enum URL {
  login = '/admin/user/login',
  logout = '/admin/user/logout',
  getInfo = '/admin/user/info',
  getCaptchaImage = '/admin/captchaImage'
}

// const getUserProfile = async () => get<UserState>({ url: URL.profile });
export const login = async (data: Type.UserRequestParams) =>
  post<Type.UserLoginRes>({ url: URL.login, data });

export const logout = async (token: string | undefined | null) =>
  post<Type.UserInfoRes>({ url: URL.logout, params: { token } });

export const getInfo = async (token: string | undefined | null) =>
  get<Type.UserInfoRes>({ url: URL.getInfo, params: { token } });

export const getCaptchaImage = async () => get({ url: URL.getCaptchaImage });
