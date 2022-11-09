import { RoleEnum } from '@/enums/roleEnum';
import type * as API from '@/api/types';

export type UserRequestParams = {
  username: string;
  password: string;
  code: string;
  uuid: string;
};

export type UserInfoData = {
  avatar?: string;
  introduction?: string;
  name?: string;
  roles: RoleEnum[];
  authorities: string[];
};

export type UserLoginVo = {
  token: string;
};

export type UserLoginRes = API.R<UserLoginVo>;

export type UserInfoRes = API.R<UserInfoData>;
