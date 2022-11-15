import { get, post, put, del, download } from '~/utils/http/axios';
import type { R, PageVo } from '../types';
import { RoleVo } from './types';

const BASE_URL = '/admin/role';

enum URL {
  roleOptionList = '/optionSelect'
}

export const roleOptionList = async () =>
  get<R<RoleVo[]>>({ url: BASE_URL + URL.roleOptionList });
