import { get, post, put, del, download } from '~/utils/http/axios';
import type { R, PageVo } from '../types';
import type { DictBody, DictSearchBody, DictVo } from './types';

enum URL {
  list = '/system/dict/data/list',
  baseUrl = '/system/dict/data/',
  export = '/system/dict/data/export'
}


export const dictList = async (dictDataBody: DictSearchBody) =>
  get<R<PageVo<DictVo[]>>>({ url: URL.list, params: dictDataBody });

export const getDict = async (dictId: number) =>
  get<R<DictVo>>({ url: URL.baseUrl + dictId });

export const addDict = async (dictBody: DictBody) =>
  post<R<DictVo>>({ url: URL.baseUrl, data: dictBody });

export const removeDict = async (dictIds: string) =>
  del<R<String>>({ url: URL.baseUrl + dictIds });

export const editDict = async (dictBody: DictBody) =>
  put<R<DictVo>>({ url: URL.baseUrl, data: dictBody });

export const exportDict = async (dictBody: DictSearchBody) =>
  download(URL.export, dictBody, `dict_${new Date().getTime()}.xlsx`);
