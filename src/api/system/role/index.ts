import { get, post, put, del, download } from '~/utils/http/axios';
import type { R, PageVo } from '../../types';
import type {
  RoleVo,
  RoleSearchBody,
  RoleAddAndEditBody,
  RoleUserSearchBody
} from './types';

const BASE_URL = '/admin/role';

enum URL {
  list = '/list',
  roleOptionList = '/optionSelect',
  export = '/export',
  allocatedList = '/authUser/allocatedList',
  unallocatedList = '/authUser/unallocatedList',
  cancelAuthUser = '/authUser/cancel',
  cancelAuthUserAll = '/authUser/cancelAll',
  selectAll = '/authUser/selectAll'
}

type UserRoleVo = {
  userId: string;
  roleId: string;
};

type UserRolesVo = {
  roleId: number | string;
  userIds: string;
};

export const roleOptionList = async () =>
  get<R<RoleVo[]>>({ url: BASE_URL + URL.roleOptionList });

export const allocatedList = async (body?: RoleUserSearchBody) =>
  get<R<PageVo<RoleVo[]>>>({ url: BASE_URL + URL.allocatedList, params: body });

export const unallocatedList = async (body?: RoleUserSearchBody) =>
  get<R<PageVo<RoleVo[]>>>({
    url: BASE_URL + URL.unallocatedList,
    params: body
  });

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

export const cancelAuthUser = async (body: UserRoleVo) =>
  put<R<RoleVo>>({ url: BASE_URL + URL.cancelAuthUser, data: body });

export const cancelAuthUserAll = async (body: UserRolesVo) =>
  put<R<RoleVo>>({ url: BASE_URL + URL.cancelAuthUserAll, params: body });

export const authUserSelectAll = async (body: UserRolesVo) =>
  put<R<RoleVo>>({ url: BASE_URL + URL.selectAll, params: body });

export const exportRole = async (RoleBody: RoleSearchBody) =>
  download(
    BASE_URL + URL.export,
    RoleBody,
    `Role_${new Date().getTime()}.xlsx`
  );
