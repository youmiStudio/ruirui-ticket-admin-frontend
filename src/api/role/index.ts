import { get, post, put, del, download } from '~/utils/http/axios';
import type { R, PageVo } from '../types';
import { RoleVo, RoleSearchBody } from './types';

const BASE_URL = '/admin/role';

enum URL {
  list = '/list',
  roleOptionList = '/optionSelect'
}

export const roleOptionList = async () =>
  get<R<RoleVo[]>>({ url: BASE_URL + URL.roleOptionList });

export const roleList = async (body?: RoleSearchBody) =>
  get<R<PageVo<RoleVo[]>>>({ url: BASE_URL + URL.list, params: body });

