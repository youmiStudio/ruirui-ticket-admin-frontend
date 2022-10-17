import { RoleEnum } from '@/enums/roleEnum';
import type * as API from '@/api/types';

export type ListRequestParams = {
  importance?: number;
  type?: any;
  title?: string;
  page?: number;
  limit?: number;
  sort?: string;
} | undefined | object;

export type ListItemsType = {
  id: string;
  timestamp: string;
  author: string;
  reviewer: string;
  title: string;
  content_short: string;
  content: string;
  forecast: number;
  importance: number;
  type: string;
  status: string;
  display_time: Date;
  comment_disabled: boolean;
  pageviews: number;
  image_uri: string;
  platforms: string[];
};

export type ListData = {
  total: number;
  items: ListItemsType[];
};

export type ListBaseResponse = API.BaseResponse<ListData>