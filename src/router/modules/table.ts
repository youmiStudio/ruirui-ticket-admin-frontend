import { RoleEnum } from '~/enums/roleEnum';
const Layout = () => import('~/layouts/default/index.vue');

const tableRouter: RouteItem = {
  path: '/table',
  component: Layout,
  redirect: '/table/complex-table',
  name: 'Table',
  meta: {
    title: 'Table',
    icon: 'table'
  },
  children: [
    {
      path: 'complex-table',
      component: () => import('@/views/table/complex-table.vue'),
      name: 'ComplexTable',
      meta: { title: 'Complex Table' }
    }
  ]
};

export default tableRouter;
