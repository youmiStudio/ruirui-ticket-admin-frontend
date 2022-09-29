import { RoleEnum } from '@/enums/roleEnum';

declare global {
  declare type UserRequestParams = {
    username: string;
    password: string;
  };

  declare type UserInfoData = {
    avatar?: string;
    introduction?: string;
    name?: string;
    roles: RoleEnum[];
  };

  declare type UserLoginRes = ApiResult<Record<string, string>>;

  declare type UserInfoRes = ApiResult<UserInfoData>;
}

export {};
