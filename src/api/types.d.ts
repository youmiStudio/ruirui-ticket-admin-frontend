export type R<T> = {
  code: number;
  data?: T;
  msg?: string;
};

/**
 * 基础提交body
 */
export type BaseSearchBody = {
  orderByColumn?: string;
  isAsc?: string;
  pageNum?: string;
  pageSize?: string;
};

/**
 * 基础的返回对象
 */
export type BaseVo = {
  /**
   * 创建者
   */
  createBy?: string;
  /**
   * 创建时间
   */
  createTime?: Date;
  /**
   * 更新者
   */
  updateBy?: string;
  /**
   * 更新时间
   */
  updateTime?: Date;
  /**
   * 备注
   */
  remark?: string;
};

/**
 * 分页信息
 */
export type PageVo<T> = {
  total: number,
  items: T
}