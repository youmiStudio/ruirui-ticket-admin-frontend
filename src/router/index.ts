import {
  createRouter,
  createWebHashHistory,
  createWebHistory
} from 'vue-router';

import permissionRouter from './modules/permission';

export const constantRoutes: RouteItem[] = [
  {
    name: 'login',
    path: '/login',
    component: () => import('~/views/login/index.vue'),
    hidden: true
  },
  {
    name: 'index',
    path: '/',
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('~/views/dashboard/index.vue'),
        name: 'Dashboard',
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    name: '404',
    path: '/404',
    component: () => import('~/views/error-page/404.vue'),
    hidden: true
  },
  {
    name: '401',
    path: '/401',
    component: () => import('~/views/error-page/401.vue'),
    hidden: true
  }
];

export const asyncRoutes: RouteItem[] = [permissionRouter];

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
  scrollBehavior: () => ({ left: 0, top: 0 })
});

export default router;
