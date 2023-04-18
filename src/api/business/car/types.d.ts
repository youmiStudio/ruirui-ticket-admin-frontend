import type { BaseSearchBody, BaseVo } from '../../types';
import type { Gallery } from '@/components/UploadImage/types';

export type CarVo = {
  /**
   * 车辆Id
   */
  carId: number;
  /**
   * 车辆名称
   */
  carName: string;
  /**
   * 车辆描述
   */
  carDescribe: string;
  /**
   * 车牌号码
   */
  carNo: string;
  /**
   * 车辆状态
   */
  status: string;

  /**
   * 图像列表
   */
  gallery?: Gallery[];
} & BaseVo;

export type CarSearchBody = Partial<
  Pick<CarVo, 'carName' | 'carNo' | 'status'>
> &
  BaseSearchBody;

export type CarAddAndEditBody = Partial<CarVo>;
