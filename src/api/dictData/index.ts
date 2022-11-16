import { get, post, put, del, download } from '~/utils/http/axios';
import type { R, PageVo } from '../types';
import type { DictDataBody, DictDataSearchBody, DictDataVo } from './types';

enum URL {
  getType = '/system/dict/data/type/',
  list = '/system/dict/data/list',
  baseUrl = '/system/dict/data/',
  export = '/system/dict/data/export'
}

export const getDictType = async (dictType:string) =>
  get({ url: URL.getType + dictType, params: {} });

export const dictDataList = async (dictDataBody: DictDataSearchBody) =>
  get<R<PageVo<DictDataVo[]>>>({ url: URL.list, params: dictDataBody });

export const getDictData = async (dictId: number) =>
  get<R<DictDataVo>>({ url: URL.baseUrl + dictId });

export const addDictData = async (dictBody: DictDataBody) =>
  post<R<DictDataVo>>({ url: URL.baseUrl, data: dictBody });

export const removeDictData = async (dictIds: string) =>
  del<R<String>>({ url: URL.baseUrl + dictIds });

export const editDictData = async (dictBody: DictDataBody) =>
  put<R<DictDataVo>>({ url: URL.baseUrl, data: dictBody });

export const exportDictData = async (dictBody: DictDataSearchBody) =>
  download(URL.export, dictBody, `dict_${new Date().getTime()}.xlsx`);
