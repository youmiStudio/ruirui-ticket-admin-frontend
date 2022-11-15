import { RoleEnum } from '~/enums/roleEnum';
const Layout = () => import('~/layouts/default/index.vue');

const systemRouter: RouteItem = {
  path: '/system',
  component: Layout,
  redirect: '/system/user',
  alwaysShow: true, // will always show the root menu
  name: 'systemManager',
  meta: {
    title: '系统管理',
    icon: 'system',
    roles: [RoleEnum.ADMIN] // you can set roles in root nav
  },
  children: [
    {
      path: 'user',
      component: () => import('@/views/system/user/index.vue'),
      name: 'userManager',
      meta: {
        title: '用户管理',
        roles: [RoleEnum.ADMIN] // or you can only set roles in sub nav
      }
    }
  ]
};

export default systemRouter;
