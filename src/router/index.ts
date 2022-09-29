import {
  createRouter,
  createWebHashHistory,
  createWebHistory
} from 'vue-router';

export const constantRoutes: RouteItem[] = [
  {
    path: '/login',
    component: () => import('~/views/login/index.vue'),
    hidden: true
  },
  {
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
  }
];

export const asyncRoutes: RouteItem[] = [];

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
  scrollBehavior: () => ({ left: 0, top: 0 })
});

export default router;
