import { get, post, put, del, download } from '~/utils/http/axios';
import type { R, PageVo } from '../../types';
import type { LoginInforVo, LoginInforSearchBody } from './types';

const BASE_URL = '/monitor/logininfor';

enum URL {
  list = '/list',
  clean = '/clean',
  export = '/export',
  unlock = '/unlock'
}

export const logininforList = async (body?: LoginInforSearchBody) =>
  get<R<PageVo<LoginInforVo[]>>>({ url: BASE_URL + URL.list, params: body });
export const unlockLogininfor = async (username: string) =>
  get<R<string>>({ url: BASE_URL + URL.unlock + `/${username}` });
export const removeLogininfo = async (ids: string) =>
  del<R<string>>({ url: BASE_URL + '/' + ids });
export const cleanLogininfo = async () =>
  del<R<string>>({ url: BASE_URL + URL.clean });
export const exportLogininfo = async (body: LoginInforSearchBody) =>
  download(
    BASE_URL + URL.export,
    body,
    `logininfor_${new Date().getTime()}.xlsx`
  );
