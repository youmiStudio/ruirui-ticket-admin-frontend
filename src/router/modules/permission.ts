import { RoleEnum } from '~/enums/roleEnum';

const permissionRouter: RouteItem = {
  name: 'Permission',
  path: '/permission',
  redirect: '/permission/role',
  alwaysShow: true, // will always show the root menu
  children: [
    {
      path: 'role',
      component: () => import('@/views/permission/role/index.vue'),
      name: 'RolePermission',
      meta: {
        title: 'Role Permission',
        roles: [RoleEnum.ADMIN]
      }
    }
  ]
};

export default permissionRouter;
