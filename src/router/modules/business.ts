import { RoleEnum } from '~/enums/roleEnum';
const Layout = () => import('~/layouts/default/index.vue');

const businessRouter: RouteItem = {
  path: '/business',
  component: Layout,
  redirect: '/business/site',
  alwaysShow: true, // will always show the root menu
  name: 'businessManager',
  meta: {
    title: '业务管理',
    icon: 'business',
    roles: [RoleEnum.ADMIN] // you can set roles in root nav
  },
  children: [
    {
      path: 'site',
      component: () => import('@/views/business/site/index.vue'),
      name: 'siteManager',
      meta: {
        title: '站点管理',
        roles: [RoleEnum.ADMIN] // or you can only set roles in sub nav
      }
    },
    {
      path: 'route',
      component: () => import('@/views/business/route/index.vue'),
      name: 'routeManager',
      meta: {
        title: '路线管理',
        roles: [RoleEnum.ADMIN] // or you can only set roles in sub nav
      }
    },
    {
      path: 'seat',
      component: () => import('@/views/business/seat/index.vue'),
      name: 'seatManager',
      meta: {
        title: '座位管理',
        roles: [RoleEnum.ADMIN] // or you can only set roles in sub nav
      }
    },
    {
      path: 'dict',
      component: () => import('@/views/business/dict/index.vue'),
      name: 'dictManager',
      meta: {
        title: '字典管理',
        roles: [RoleEnum.ADMIN] // or you can only set roles in sub nav
      }
    }
  ]
};

export default businessRouter;
