// 权限问题后期增加
import { get, post } from '~/utils/http/axios';

enum URL {
  login = '/user/login',
  logout = '/user/logout',
}


// const getUserProfile = async () => get<UserState>({ url: URL.profile });
export const login = async (data: UserRequestParams) => post<UserRes>({ url: URL.login, data });
// const logout = async () => post<LoginRes>({ url: URL.logout });
// export { getUserProfile, logout, login };
