import { get, post, put, del, download } from '~/utils/http/axios';
import type { R, PageVo } from '../../types';
import type { OperlogSearchBody, OperlogVo } from './types';

const BASE_URL = '/monitor/operlog';

enum URL {
  list = '/list',
  clean = '/clean',
  export = '/export'
}

export const operlogList = async (body?: OperlogSearchBody) =>
  get<R<PageVo<OperlogVo[]>>>({ url: BASE_URL + URL.list, params: body });
export const removeOperlog = async (ids: string) =>
  del<R<string>>({ url: BASE_URL + '/' + ids});
export const cleanOperlog = async () =>
  del<R<string>>({ url: BASE_URL + '/' + URL.clean });
export const exportOperlog = async (body: OperlogSearchBody) =>
  download(
    BASE_URL + '/' + URL.export,
    body,
    `route_${new Date().getTime()}.xlsx`
  );
