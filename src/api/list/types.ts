import type * as API from '@/api/types'

type SearchUserResponseItemsType = {
  name: string;
};

export type transactionListResponseItemsType = {
  order_no: string;
  timestamp: Date;
  username: string;
  price: number;
  status: 'success' | 'pending';
};

type SearchUserResponseType = {
  items: SearchUserResponseItemsType[];
};

type transactionListResponseType = {
  total: number;
  items: transactionListResponseItemsType[];
};

export type SearchUserResponse = API.BaseResponse<SearchUserResponseType>;

export type transactionListResponse = API.BaseResponse<transactionListResponseType>;

