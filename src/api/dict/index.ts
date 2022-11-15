import { get, post, put, del, download } from '~/utils/http/axios';
import type { R, PageVo } from '../types';
import type {  DictTypeSearchBody, DictTypeVo, DictTypeBody } from './types';

enum URL {
  getType = '/system/dict/data/type/',
  
  list = '/system/dict/type/list',
  baseUrl = '/system/dict/type',
  export = '/system/dict/type/export'
}

export const getDictType = async (dictType:string) =>
  get({ url: URL.getType + dictType, params: {} });


export const dictList = async (dictTypeBody: DictTypeSearchBody) =>
  get<R<PageVo<DictTypeVo[]>>>({ url: URL.list, params: dictTypeBody });

export const getDict = async (dictId: number) =>
  get<R<DictTypeVo>>({ url: URL.baseUrl + dictId });

export const addDict = async (dictBody: DictTypeBody) =>
  post<R<DictTypeVo>>({ url: URL.baseUrl, data: dictBody });

export const removeDict = async (dictIds: string) =>
  del<R<String>>({ url: URL.baseUrl + dictIds });

export const editDict = async (dictBody: DictTypeBody) =>
  put<R<DictTypeVo>>({ url: URL.baseUrl, data: dictBody });

export const exportDict = async (dictBody: DictTypeSearchBody) =>
  download(URL.export, dictBody, `dict_${new Date().getTime()}.xlsx`);
