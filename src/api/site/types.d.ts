import type { BaseVo, BaseSearchBody } from '../types';

/**
 * 站点信息 - 请求对象
 */
export type SiteBody = {
  /**
   * 站点名称
   */
  siteName?: string;
  /**
   * 站点状态
   */
  status?: string;
  /**
   * 其他请求参数
   */
  params?: {
    /**
     * 创建时间 - 开始
     */
    beginTime?: Date;
    /**
     * 创建时间 - 结束
     */
    endTime?: Date;
  };
} & BaseSearchBody;

/**
 * 站点信息 - 返回对象
 */
export type SiteVo = {
  /**
   * 站点Id
   */
  siteId?: number | null;
  /**
   * 站点名称
   */
  siteName?: string;
  /**
   * 站点描述
   */
  siteDescribe?: string;
  /**
   * 站点拼音
   */
  sitePinyin?: string;
  /**
   * 站点状态
   */
  status?: string;
} & BaseVo;
