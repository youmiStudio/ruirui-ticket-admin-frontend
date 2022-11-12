import type { SiteVo } from '~/api/site/type';
import type { BaseVo } from '../types';

/**
 * 路线信息 - 请求对象
 */
export type RouteSearchBody = {
  /**
   * 路线名称
   */
  routeName?: String;
  /**
   * 路线状态
   */
  state?: String;
  /**
   * 起始站点ID
   */
  formSiteId?: Number;
  /**
   * 目的站点ID
   */
  toSiteId?: Number;
  /**
   * 其他请求参数
   */
  parmas?: {
    /**
     * 起始站点名称
     */
    fromSiteName?: String;
    /**
     * 目的站点名称
     */
    toSiteName?: String;
    /**
     * 创建时间 - 开始
     */
    beginTime?: Date;
    /**
     * 创建时间 - 截止
     */
    endTime?: Date;
  };
};

/**
 * 新增路线 - 请求体
 */
export type RouteAddBody = Pick<
  RouteVo,
  'routeName' | 'routeDescribe' | 'fromSiteId' | 'toSiteId' | 'state' | 'remark'
>;

/**
 * 编辑路线 - 请求体
 */
export type RouteEditBody = Pick<RouteVo, 'routeId'> & RouteAddBody;

/**
 * 站点信息 - 返回对象
 */
export type RouteVo = {
  /**
   * 路线Id
   */
  routeId: number;
  /**
   * 路线名称
   */
  routeName: string;
  /**
   * 路线描述
   */
  routeDescribe: string;
  /**
   * 起始站点Id
   */
  fromSiteId: number;
  /**
   * 目的站点Id
   */
  toSiteId: number;
  /**
   * 状态
   */
  state: string;
  /**
   * 起始站信息
   */
  fromSite: SiteVo;
  /**
   * 目的站信息
   */
  toSite: SiteVo;
} & BaseVo;
