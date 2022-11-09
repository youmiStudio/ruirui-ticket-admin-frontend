export type SiteBody = {
  siteName?: string;
  status?: string;
  params?: {
    beginTime?: Date;
    endTime?: Date;
  };
};

export type SiteVo = {
  siteId?: number;
  siteName: string;
  siteDescribe?: string;
  sitePinyin: string;
  status?: string;
  createBy: string;
  createTime: Date;
  updateBy?: string;
  updateTime?: Date;
  remark?: string;
};
