import type { BaseSearchBody, BaseVo } from '@/api/types';

/**
 * 操作日志对象
 */
export type OperlogVo = {
  /**
   * 日志主键
   */
  operId: number;
  /**
   * 操作模块
   */
  title: string;
  /**
   * 业务类型
   */
  businessType: number | string;
  /**
   * 业务类型数组
   */
  businessTypes: number[];
  /**
   * 请求方法
   */
  method: string;
  /**
   * 请求方式
   */
  requestMethod: string;
  /**
   * 操作类别
   */
  operatorType: number;
  /**
   * 操作人员
   */
  operName: string;
  /**
   * 请求地址
   */
  operUrl: string;
  /**
   * 操作地址
   */
  operIp: string;
  /**
   * 操作地点
   */
  operLocation: string;
  /**
   * 请求参数
   */
  operParam: string;
  /**
   * 返回参数
   */
  jsonResult: string;
  /**
   * 错误消息
   */
  errorMsg: string;
  /**
   * 状态
   */
  status: number | string;
  /**
   * 操作时间
   */
  operTime: string;
} & BaseVo;

export type OperlogSearchBody = Partial<
  Pick<OperlogVo, 'title' | 'operName' | 'businessType' | 'status' | 'operTime'>
> &
  BaseSearchBody;
