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
    },
    {
      path: 'user-auth/role/:userId',
      component: () => import('@/views/system/user/authRole.vue'),
      name: 'userRoleManager',
      hidden: true,
      meta: {
        title: '分配角色',
        roles: [RoleEnum.ADMIN], // or you can only set roles in sub nav
        activeMenu:"/system/user"
      }
    },
    {
      path: 'role',
      component: () => import('@/views/system/role/index.vue'),
      name: 'roleManager',
      meta: {
        title: '角色管理',
        roles: [RoleEnum.ADMIN] // or you can only set roles in sub nav
      }
    },
    {
      path: 'dict',
      component: () => import('@/views/system/dict/index.vue'),
      name: 'dictManager',
      meta: {
        title: '字典管理',
        roles: [RoleEnum.ADMIN] // or you can only set roles in sub nav
      }
    },
    {
      path: 'dict-data/:dictType',
      component: () => import('@/views/system/dict/data.vue'),
      name: 'ditaDataManager',
      hidden: true,
      meta: {
        title: '字典数据',
        roles: [RoleEnum.ADMIN], // or you can only set roles in sub nav
        activeMenu:"/system/dict"
      }
    }
  ]
};

export default systemRouter;
