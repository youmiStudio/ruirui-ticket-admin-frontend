import { createRouter, createWebHashHistory } from 'vue-router';

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    hidden: true
  },
  {
    path: '/',
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        name: 'Dashboard',
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
      }
    ]
  },
];

export const asyncRoutes = [];

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes
});

export default router;
