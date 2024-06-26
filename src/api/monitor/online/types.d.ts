import type { BaseSearchBody, BaseVo } from '@/api/types';

/**
 * 在线用户对象
 */
export type OnlineUserVo = {
  /**
   * 会话编号
   */
  tokenId: string;
  /**
   * 用户名称
   */
  userName: string;
  /**
   * 登录IP地址
   */
  ipaddr: string;
  /**
   * 登录地址
   */
  loginLocation: string;
  /**
   * 浏览器类型
   */
  browser: string;
  /**
   * 操作系统
   */
  os: string;
  /**
   * 登录时间
   */
  loginTime: number;
};

export type OnlineUserSearchBody = Partial<Pick<OnlineUserVo, 'userName' | 'ipaddr'>>