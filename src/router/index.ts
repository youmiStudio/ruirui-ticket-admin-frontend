import {
  createRouter,
  createWebHashHistory,
  createWebHistory
} from 'vue-router';

const Layout = () => import('~/layouts/default/index.vue');

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
        name: 'dashboard',
        meta: {
          title: 'Dashboard',
          icon: 'dashboard',
          affix: true,
          noCache: true
        }
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
        name: 'redirectCmp',
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  }
];

export const asyncRoutes: RouteItem[] = [
  {
    name: 'userRoleManager',
    path: '/system/user-auth',
    component: Layout,
    hidden: true,
    permissions: ['system:user:edit'],
    children: [
      {
        path: 'role/:userId',
        component: () => import('@/views/system/user/authRole.vue'),
        name: 'AuthRole',
        meta: { title: '分配角色', activeMenu: '/system/user' }
      }
    ]
  },
  {
    name: 'roleUserManager',
    path: '/system/role-auth',
    component: Layout,
    hidden: true,
    permissions: ['system:role:edit'],
    children: [
      {
        path: 'user/:roleId',
        component: () => import('@/views/system/role/authUser.vue'),
        name: 'AuthUser',
        meta: { title: '分配用户', activeMenu: '/system/role' }
      }
    ]
  },
  {
    name: 'ditaDataManager',
    path: '/system/dict-data',
    component: Layout,
    hidden: true,
    permissions: ['system:dict:list'],
    children: [
      {
        path: ':dictType',
        component: () => import('@/views/system/dict/data.vue'),
        name: 'Data',
        meta: { title: '字典数据', activeMenu: '/system/dict' }
      }
    ]
  },
  {
    name: 'editSeatScheme',
    path: '/ticket/seat-scheme/edit',
    hidden: true,
    permissions: ['ticket:seatScheme:edit'],
    children: [
      {
        path: ':seatSchemeId',
        component: () => import('~/views/business/seat-scheme/detail/index.vue'),
        name: 'EditSeatScheme',
        meta: { title: '分配座位', activeMenu: '/ticket/car' }
      }
    ]
  },
  {
    name: 'addSeatScheme',
    path: '/ticket/seat-scheme/add',
    hidden: true,
    permissions: ['ticket:seatScheme:add'],
    children: [
      {
        path: '',
        component: () => import('~/views/business/seat-scheme/detail/index.vue'),
        name: 'ConfigSeat',
        meta: { title: '分配座位', activeMenu: '/ticket/car' }
      }
    ]
  },
  {
    name: 'orderDetail',
    path: '/ticket/order/detail',
    hidden: true,
    component: Layout,
    permissions: ['ticket:order:query'],
    children: [
      {
        path: ':orderSn',
        component: () => import('~/views/business/order/detail.vue'),
        name: 'orderDetailBySn',
        meta: { title: '订单详情', activeMenu: '/ticket/order' }
      }
    ]
  },
  {
    name: 'routeAdd',
    path: '/ticket/route/add',
    hidden: true,
    component: Layout,
    permissions: ['ticket:route:add'],
    children: [
      {
        name: 'routeAddView',
        path: '',
        component: () => import('~/views/business/route/detail.vue'),
        meta: { title: '路线详情', activeMenu: '/ticket/route' }
      },
    ]
  },
  {
    name: 'routeDetail',
    path: '/ticket/route/detail',
    hidden: true,
    component: Layout,
    permissions: ['ticket:route:query'],
    children: [
      {
        name: 'routeDetailById',
        path: ':routeId',
        component: () => import('~/views/business/route/detail.vue'),
        meta: { title: '路线详情', activeMenu: '/ticket/route' }
      },
    ]
  },
  {
    name: 'routeEdit',
    path: '/ticket/route/edit',
    hidden: true,
    component: Layout,
    permissions: ['ticket:route:edit'],
    children: [
      {
        name: 'routeEditById',
        path: ':routeId',
        component: () => import('~/views/business/route/detail.vue'),
        meta: { title: '路线详情', activeMenu: '/ticket/route' }
      },
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
  scrollBehavior: () => ({ left: 0, top: 0 })
});

/**
 * recursion add route children and route
 * @param {object} route
 * @param {string} parentName
 */
export const addRoutesHelper = (
  route: RouteItem,
  parentName?: string
): void => {
  parentName ? router.addRoute(parentName, route) : router.addRoute(route);
  if (route.children) {
    route.children.forEach((childRoute) => {
      addRoutesHelper(childRoute, route.name);
    });
  }
};

/**
 * dynamically add accessible routes
 * @param {Array} routes
 */
export const addRoutes = (routes: RouteItem[]) => {
  routes.forEach((route) => {
    if (route.meta && route.meta.link) return;
    addRoutesHelper(route);
  });
};

export default router;
