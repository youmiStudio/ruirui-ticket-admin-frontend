import type { SiteVo } from '~/api/site/type';
import type { baseVo } from '../types';

/**
 * 路线信息 - 请求对象
 */
export type RouteBody = {
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
 * 站点信息 - 返回对象
 */
export type routeVo = {
  
} & baseVo;
