import {
  createRouter,
  createWebHashHistory,
  createWebHistory
} from 'vue-router';

const Layout = () => import('~/layouts/default/index.vue');

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
    component: Layout,
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
  },
  {
    name: 'redirect',
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  }
];

export const asyncRoutes: RouteItem[] = [permissionRouter];

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
  scrollBehavior: () => ({ left: 0, top: 0 })
});

export default router;
