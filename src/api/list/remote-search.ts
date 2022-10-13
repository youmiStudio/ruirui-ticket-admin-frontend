import { get, post } from '~/utils/http/axios';
import type * as Type from './types'

enum URL {
  searchUser = '/search/user',
  transactionList = '/transaction/list'
}

// const getUserProfile = async () => get<UserState>({ url: URL.profile });
export const searchUser = async (name: string) =>
  get<Type.SearchUserResponse>({ url: URL.searchUser, params: { name } });

export const transactionList = async () =>
  get<Type.transactionListResponse>({ url: URL.transactionList });
