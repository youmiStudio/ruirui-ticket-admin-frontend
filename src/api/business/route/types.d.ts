import type { SiteVo } from '~/api/business/site/types';
import type { BaseSearchBody, BaseVo } from '../../types';

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
   * 起始站点ID
   */
  fromSiteId?: Number | string;
  /**
   * 目的站点ID
   */
  toSiteId?: Number | string;
  /**
   * 其他请求参数
   */
  parmas?: {
    /**
     * 起始站点名称
     */
    fromSiteName?: string;
    /**
     * 目的站点名称
     */
    toSiteName?: string;
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
  | 'routeId'
  | 'routeName'
  | 'routeDescribe'
  | 'fromSiteId'
  | 'toSiteId'
  | 'status'
  | 'remark'
>;

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
  status: string;
  /**
   * 起始站信息
   */
  fromSite: SiteVo;
  /**
   * 目的站信息
   */
  toSite: SiteVo;
} & BaseVo;
