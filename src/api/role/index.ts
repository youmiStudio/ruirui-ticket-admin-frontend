import { get, post, put, del, download } from '~/utils/http/axios';
import type { R, PageVo } from '../types';
import { RoleVo, RoleSearchBody, RoleAddAndEditBody } from './types';

const BASE_URL = '/admin/role';

enum URL {
  list = '/list',
  roleOptionList = '/optionSelect',
  export = '/export'
}

export const roleOptionList = async () =>
  get<R<RoleVo[]>>({ url: BASE_URL + URL.roleOptionList });

export const roleList = async (body?: RoleSearchBody) =>
  get<R<PageVo<RoleVo[]>>>({ url: BASE_URL + URL.list, params: body });

export const getRole = async (id: number) =>
  get<R<RoleVo>>({ url: BASE_URL + '/' + id });

export const addRole = async (body: RoleAddAndEditBody) =>
  post<R<RoleVo>>({ url: BASE_URL, data: body });

export const removeRole = async (ids: string) =>
  del<R<String>>({ url: BASE_URL + '/' + ids });

export const editRole = async (body: RoleAddAndEditBody) =>
  put<R<RoleVo>>({ url: BASE_URL, data: body });

export const exportRole = async (RoleBody: RoleSearchBody) =>
  download(
    BASE_URL + URL.export,
    RoleBody,
    `Role_${new Date().getTime()}.xlsx`
  );
