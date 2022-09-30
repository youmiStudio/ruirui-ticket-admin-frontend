import { defineStore } from 'pinia';

import { asyncRoutes, constantRoutes } from '@/router';
import { RoleEnum } from '~/enums/roleEnum';

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles: RoleEnum[], route: RouteItem): boolean {
  if (route.meta && route.meta.roles) {
    return roles.some(
      (role) =>
        route.meta && route.meta.roles && route.meta.roles.includes(role)
    );
  } else {
    return true;
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(
  routes: RouteItem[],
  roles: RoleEnum[]
): RouteItem[] {
  const res: RouteItem[] = [];

  routes.forEach((route) => {
    const tmp = { ...route };
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles);
      }
      res.push(tmp);
    }
  });

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
    generateRoutes(roles: RoleEnum[]): Promise<RouteItem[]> {
      return new Promise((resolve) => {
        let accessedRoutes;
        if (roles.includes(RoleEnum.ADMIN)) {
          accessedRoutes = asyncRoutes || [];
        } else {
          accessedRoutes = filterAsyncRoutes(asyncRoutes, roles);
        }

        this.addRoutes = [...accessedRoutes];
        this.routes = [...constantRoutes, ...accessedRoutes];

        resolve(accessedRoutes);
      });
    }
  }
});
