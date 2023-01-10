import type { BaseSearchBody, BaseVo } from '../../types';

export type CarVo = {
  /**
   * 车辆Id
   */
  carId:number;
  /**
   * 车辆名称
   */
  carName:string;
  /**
   * 车辆描述
   */
  carDescribe:string;
  /**
   * 车牌号码
   */
  carNo:string;
  /**
   * 车辆座位平面图
   */
  carSeatImage:string;
  /**
   * 车辆状态
   */
  status:string
} & BaseVo

export type CarSearchBody = Partial<Pick<CarVo, 'carName' | 'carNo' | 'status'>> & BaseSearchBody

export type CarAddAndEditBody = Partial<CarVo>;