import { RoleEnum } from '@/enums/roleEnum';
import type * as API from '@/api/types'

export type UserRequestParams = {
  username: string;
  password: string;
};

export type UserInfoData = {
  avatar?: string;
  introduction?: string;
  name?: string;
  roles: RoleEnum[];
};

export type UserLoginRes = API.BaseResponse<Record<string, string>>;

export type UserInfoRes = API.BaseResponse<UserInfoData>;