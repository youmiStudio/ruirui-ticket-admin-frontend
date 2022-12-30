import { defineStore } from 'pinia';

import { asyncRoutes, constantRoutes } from '@/router';
import { RoleEnum } from '~/enums/roleEnum';
import { getRouters } from '@/api/user';

import Layout from '@/layouts/default/index.vue';

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap: RouteItem[], type = false) {
  return asyncRouterMap.filter((route) => {
    if (type && route.children) {
      route.children = filterChildren(route.children);
    }
    if (route.component) {
      // Layout ParentView 组件特殊处理
      if (route.component === 'Layout') {
        route.component = Layout;
      } else {
        route.component = loadView(route.component);
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, type);
    } else {
      delete route['children'];
      delete route['redirect'];
    }
    return true;
  });
}

function filterChildren(childrenMap: RouteItem[], lastRouter?: RouteItem) {
  var children: any[] = [];
  childrenMap.forEach((el, index) => {
    if (el.children && el.children.length) {
      if (el.component === 'ParentView' && !lastRouter) {
        el.children.forEach((c) => {
          c.path = el.path + '/' + c.path;
          if (c.children && c.children.length) {
            children = children.concat(filterChildren(c.children, c));
            return;
          }
          children.push(c);
        });
        return;
      }
    }
    if (lastRouter) {
      el.path = lastRouter.path + '/' + el.path;
    }
    children = children.concat(el);
  });
  return children;
}

export const loadView = (view: string) => {
  let dynamicViewsModules: Record<string, () => Promise<Recordable>>;

  dynamicViewsModules = import.meta.glob('@/views/**/*.{vue,tsx}')
  return dynamicImport(dynamicViewsModules,`src/views/${view}`);
};

function dynamicImport(
  dynamicViewsModules: Record<string, () => Promise<Recordable>>,
  component: string,
) {
  const keys = Object.keys(dynamicViewsModules);
  const matchKeys = keys.filter((key) => {
    const k = key.replace('@/views', '');
    const startFlag = component.startsWith('/');
    const endFlag = component.endsWith('.vue') || component.endsWith('.tsx');
    const startIndex = startFlag ? 0 : 1;
    const lastIndex = endFlag ? k.length : k.lastIndexOf('.');
    return k.substring(startIndex, lastIndex) === component;
  });
  if (matchKeys?.length === 1) {
    const matchKey = matchKeys[0];
    return dynamicViewsModules[matchKey];
  } else if (matchKeys?.length > 1) {
    console.warn(
      'Please do not create `.vue` and `.TSX` files with the same file name in the same hierarchical directory under the views folder. This will cause dynamic introduction failure',
    );
    return;
  } else {
    console.warn('在src/views/下找不到`' + component + '.vue` 或 `' + component + '.tsx`, 请自行创建!');
    return;
  }
}

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasRolesPermission(roles: RoleEnum[], route: RouteItem): boolean {
  if (route.meta && route.meta.roles) {
    return roles.some(
      (role) =>
        route.meta && route.meta.roles && route.meta.roles.includes(role)
    );
  } else {
    return false;
  }
}

function hasAuthoritiesPermission(
  authorities: string[],
  route: RouteItem
): boolean {
  const all_permission = '*:*:*';
  if (route.permissions && route.permissions.length > 0) {
    return authorities.some((v) => {
      return v === all_permission || route.permissions?.includes(v)
    });
  } else {
    return false;
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(
  routes: RouteItem[],
  roles: RoleEnum[],
  authorities: string[]
): RouteItem[] {
  const res: RouteItem[] = [];

  routes.forEach((route) => {
    const tmp = { ...route };
    if (
      hasAuthoritiesPermission(authorities, tmp) ||
      hasRolesPermission(roles, tmp)
    ) {
      if (tmp.children && tmp.children.length > 1) {
        tmp.children = filterAsyncRoutes(tmp.children, roles, authorities);
      }
      res.push(tmp);
    }
  });

  console.log(res);
  return res;
}

export const usePermissionStore = defineStore({
  id: 'permission',
  state: (): PermissionStoreState => ({
    routes: [],
    addRoutes: []
  }),
  getters: {},
  actions: {
    generateRoutes(
      roles: RoleEnum[],
      authorities: string[]
    ): Promise<RouteItem[]> {
      return new Promise((resolve) => {
        getRouters().then((res) => {
          let accessedRoutes;
          let dynamicRoutes = res.data;

          dynamicRoutes = filterAsyncRouter(dynamicRoutes as RouteItem[], true);

          accessedRoutes = filterAsyncRoutes(asyncRoutes, roles, authorities);

          this.addRoutes = [...accessedRoutes, ...dynamicRoutes];
          this.routes = [
            ...constantRoutes,
            ...accessedRoutes,
            ...dynamicRoutes
          ];

          console.log('dynamicRoutes==>',dynamicRoutes);

          resolve([...accessedRoutes,...dynamicRoutes]);
        });
      });
    }
  }
});
