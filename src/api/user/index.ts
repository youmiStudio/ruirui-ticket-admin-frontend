// 权限问题后期增加
import { get, post } from '~/utils/http/axios';

enum URL {
  login = '/user/login',
  logout = '/user/logout',
  getInfo = '/user/info'
}

// const getUserProfile = async () => get<UserState>({ url: URL.profile });
export const login = async (data: UserRequestParams) =>
  post<UserLoginRes>({ url: URL.login, data });
export const getInfo = async (token: string | undefined | null) =>
  get<UserInfoRes>({ url: URL.getInfo, params: { token } });

// const logout = async () => post<LoginRes>({ url: URL.logout });
// export { getUserProfile, logout, login };
