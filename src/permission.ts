import router, { addRoutes } from './router';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
import { ElMessage } from 'element-plus';

import { useUserStore, usePermissionStore } from '@/store';
import { getToken } from '@/utils/auth';
import getPageTitle from '@/utils/get-page-title';

NProgress.configure({ showSpinner: false }); // NProgress Configuration
const whiteList = ['/login', '/auth-redirect']; // no redirect whitelist

const addErrorRoutes = () => {
  router.addRoute({
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/404'
  });
};

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start();

  // set page title
  document.title = getPageTitle(to.meta.title);

  // determine whether the user has logged in
  const hasToken = getToken();
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' });
      NProgress.done(); // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
    } else {
      const userStore = useUserStore();
      const permissionStore = usePermissionStore();

      const hasRoles = userStore.roles?.length && userStore.roles?.length > 0;
      if (hasRoles) {
        next();
      } else {
        try {
          // get user info
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          const { roles } = await userStore.getInfo();

          // generate accessible routes map based on roles
          const accessRoutes = await permissionStore.generateRoutes(roles);

          // dynamically add accessible routes
          addRoutes(accessRoutes);

          // dynamically add errorPageRoutes
          addErrorRoutes();

          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true });
        } catch (error) {
          // remove token and go to login page to re-login
          const userStore = useUserStore();
          await userStore.resetToken();
          ElMessage({
            message: "error || 'Has Error'",
            type: 'error'
          });
          next(`/login?redirect=${to.path}`);
          NProgress.done();
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next();
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});
