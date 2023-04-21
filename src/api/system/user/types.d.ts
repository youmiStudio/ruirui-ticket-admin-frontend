import { RoleEnum } from '@/enums/roleEnum';
import type { BaseSearchBody, BaseVo } from '@/api/types';
import { RoleVo } from '../role/types';

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
  rsaKey:string;
};

export type UserLoginVo = {
  token: string;
};

export type UserLoginRes = API.R<UserLoginVo>;

export type UserInfoRes = API.R<UserInfoData>;

/**
 * 用户信息对象
 */
export type UserVo = {
  /**
   * 用户Id
   */
  userId: number | string;
  /**
   * 微信小程序openId
   */
  openId?: string;
  /**
   * 微信小程序unionId
   */
  unionId?: string;
  /**
   * 用户名
   */
  username: string;
  /**
   * 密码
   */
  password?: string;
  /**
   * 用户昵称
   */
  nickname: string;
  /**
   * 性别
   */
  sex: string;
  /**
   * 头像地址
   */
  avatar: string;
  /**
   * 手机账号
   */
  phoneNumber: string;
  /**
   * 最后一次，登录IP
   */
  loginIp: string;
  /**
   * 最后一次，登录时间
   */
  loginDate: string;
  /**
   * 用户状态
   */
  status: string;

  /**
   * 角色组
   */
  roles: RoleVo[];

  /**
   * 角色Id
   */
  roleId?: number;

  /**
   * 角色组Id
   */
  roleIds?: number[];
} & BaseVo;

export type UserSearchBody = Partial<
  Pick<UserVo, 'username' | 'phoneNumber' | 'status'>
> &
  BaseSearchBody;

export type UserBody = Partial<
  Pick<
    UserVo,
    | 'userId'
    | 'username'
    | 'password'
    | 'nickname'
    | 'phoneNumber'
    | 'sex'
    | 'roleIds'
    | 'remark'
    | 'status'
  >
>;
