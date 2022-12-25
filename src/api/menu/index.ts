import { get, post, put, del, download } from '~/utils/http/axios';
import type { R, PageVo } from '../types';
import type {
  MenuVo,
  MenuAddAndEditBody,
  MenuSearchBody,
  MenuSelectVo,
  MenuRoleSelectVo
} from './types';

const BASE_URL = '/admin/menu';

enum URL {
  list = '/list',
  export = '/export',
  treeSelect = '/treeSelect',
  roleMenuTreeSelect = '/roleMenuTreeSelect'
}

export const getTreeSelect = async () =>
  get<R<MenuSelectVo[]>>({ url: BASE_URL + URL.treeSelect });

export const getRoleMenuTreeSelect = async (roleId: number) =>
  get<R<MenuRoleSelectVo>>({
    url: BASE_URL + URL.roleMenuTreeSelect + '/' + roleId
  });

export const menuList = async (body?: MenuSearchBody) =>
  get<R<PageVo<MenuVo[]>>>({ url: BASE_URL + URL.list, params: body });

export const getMenu = async (id: number) =>
  get<R<MenuVo>>({ url: BASE_URL + '/' + id });

export const addMenu = async (body: MenuAddAndEditBody) =>
  post<R<MenuVo>>({ url: BASE_URL, data: body });

export const removeMenu = async (ids: string) =>
  del<R<String>>({ url: BASE_URL + '/' + ids });

export const editRole = async (body: MenuAddAndEditBody) =>
  put<R<MenuVo>>({ url: BASE_URL, data: body });

export const exportRole = async (RoleBody: MenuSearchBody) =>
  download(
    BASE_URL + URL.export,
    RoleBody,
    `Role_${new Date().getTime()}.xlsx`
  );
