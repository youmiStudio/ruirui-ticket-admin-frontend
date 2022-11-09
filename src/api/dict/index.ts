import { get } from '~/utils/http/axios';

enum URL {
  getType = '/system/dict/data/type/',
}

export const getDictType = async (dictType:string) =>
  get({ url: URL.getType + dictType, params: {} });
