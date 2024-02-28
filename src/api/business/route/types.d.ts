import type { SiteVo } from '~/api/business/site/types';
import type { BaseSearchBody, BaseVo } from '../../types';
import { CarVo } from '../car/types';

export type PickupLocation = {
  name: string;
  location: string;
  address: string;
};

/**
 * 路线信息 - 请求对象
 */
export type RouteSearchBody = {
  /**
   * 路线名称
   */
  routeName?: string;
  /**
   * 路线状态
   */
  status?: string;
  /**
   * 其他请求参数
   */
  parmas?: {
    /**
     * 创建时间 - 开始
     */
    beginTime?: Date;
    /**
     * 创建时间 - 截止
     */
    endTime?: Date;
  };
} & BaseSearchBody;

/**
 * 新增路线 - 请求体
 */
export type RouteBody = Pick<
  RouteVo,
  'routeId' | 'routeName' | 'routeDescribe' | 'status' | 'remark'
>;

export type RouteGallery = {
  /**
   * 路线图片ID
   */
  routeGalleryId: number;
  /**
   * 路线ID
   */
  routeId: number;
  /**
   * 图片原始地址
   */
  original: string;
  /**
   * 顺序
   */
  sort: number;
};

export type RouteSku = {
  /**
   * 路线时间段
   */
  routeSkuId?: number;
  /**
   * 路线ID
   */
  routeId?: number;
  /**
   * 车辆ID
   */
  carId: number;
  /**
   * 时间段名称
   */
  name: string;

  car?: CarVo;

  sort: number;
  flag?: 'local';
};

/**
 * 站点信息 - 返回对象
 */
export type RouteVo = {
  /**
   * 路线Id
   */
  routeId?: number;
  /**
   * 路线名称
   */
  routeName: string;
  /**
   * 路线描述
   */
  routeDescribe: string;

  /**
   * 路线详情
   */
  routeDetail: string;

  /**
   * 主图
   */
  mainImgUrl: string;

  /**
   * 开始时间
   */
  beginTime: string;

  /**
   * 结束时间
   */
  endTime: string;

  /**
   * 路线图片
   */
  gallery: RouteGallery[];

  sku: RouteSku[];

  pickupLocation: PickupLocation;

  routeNotice: string;

  /**
   * 状态
   */
  status: string;
} & BaseVo;

export type RouteDTO = RouteVo;
