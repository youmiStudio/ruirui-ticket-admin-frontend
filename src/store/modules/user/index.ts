import { defineStore } from 'pinia';
import { getToken, setToken, removeToken } from '~/utils/auth';
import { login, getInfo, logout } from '~/api/system/user';
import { useTagsViewStore, usePermissionStore } from '@/store';
import type * as API from '~/api/system/user/types';
import { addRoutes } from '@/router';

export const useUserStore = defineStore({
  id: 'user',
  state: (): UserStoreState => ({
    token: getToken(),
    name: '',
    avatar: '',
    introduction: '',
    roles: [],
    authorities: []
  }),
  getters: {},
  actions: {
    login(loginForm: API.UserRequestParams): Promise<API.UserLoginRes> {
      const { username, password, code, uuid } = loginForm;
      return new Promise(async (resolve, reject) => {
        login({ username: username.trim(), password, code, uuid })
          .then((response) => {
            const { data } = response;
            if (data) {
              const { token } = data;
              this.token = token;
              if (token) {
                setToken(token);
              }
            }

            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    getInfo(): Promise<API.UserInfoData> {
      return new Promise(async (resolve, reject) => {
        getInfo(this.token)
          .then((response) => {
            const { data } = response;

            if (!data) {
              reject('Verification failed, please Login again.');
              return;
            }

            const { roles, name, avatar, introduction, authorities } = data;

            // roles must be a non-empty array
            if (!roles || roles.length <= 0) {
              reject('getInfo: roles must be a non-null array!');
            }

            this.name = name;
            this.avatar = avatar;
            this.introduction = introduction;
            this.roles = roles;
            this.authorities = authorities;

            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // user logout
    logout(): Promise<''> {
      return new Promise((resolve, reject) => {
        logout(this.token)
          .then(() => {
            this.$patch({
              token: '',
              roles: []
            });
            removeToken();
            const tagesView = useTagsViewStore();
            // // reset visited views and cached views
            // // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
            tagesView.delAllViews();
            resolve('');
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // remove token
    resetToken() {
      return new Promise((resolve) => {
        this.token = '';
        this.roles = [];
        removeToken();
        setTimeout(() => {}, 500);
      });
    },
    // dynamically modify permissions
    changeRoles(role: string): Promise<boolean> {
      return new Promise(async (resolve) => {
        const token = role + '-token';

        this.token = token;
        setToken(token);

        const { roles, authorities } = await this.getInfo();

        // generate accessible routes map based on roles
        const permissionStroe = usePermissionStore();
        const accessRoutes = await permissionStroe.generateRoutes(
          roles,
          authorities
        );
        addRoutes(accessRoutes);

        // reset visited views and cached views
        const tagesViewStore = useTagsViewStore();
        tagesViewStore.delAllViews();

        resolve(true);
      });
    }
  }
});
