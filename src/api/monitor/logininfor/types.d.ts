import type { BaseSearchBody, BaseVo } from '@/api/types';

export type LoginInforVo = {
  infoId: number;
  userName: string;
  status: string;
  ipaddr: string;
  loginLocation: string;
  browser: string;
  os: string;
  msg: string;
  loginTime: string;
} & BaseVo;

export type LoginInforSearchBody = Partial<Pick<LoginInforVo, 'ipaddr' | 'userName' | 'status' | 'loginTime'>> & BaseSearchBody