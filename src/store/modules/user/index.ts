import { defineStore } from 'pinia';
import { getToken, setToken, removeToken } from '~/utils/auth';
import { login, getInfo, logout } from '@/api/user';
import { useTagsViewStore } from '@/store';

export const useUserStore = defineStore({
  id: 'user',
  state: (): UserStoreState => ({
    token: getToken(),
    name: '',
    avatar: '',
    introduction: '',
    roles: []
  }),
  getters: {
    getToken: (state) => state.token,
    getRoles: (state) => state.roles
  },
  actions: {
    login(loginForm: UserRequestParams) {
      const { username, password } = loginForm;
      return new Promise(async (resolve, reject) => {
        login({ username: username.trim(), password })
          .then((response) => {
            const {
              data: { token }
            } = response;
            this.$patch({
              token
            });
            setToken(token);
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    getInfo(): Promise<UserInfoData> {
      return new Promise(async (resolve, reject) => {
        getInfo(this.token)
          .then((response) => {
            const { data } = response;

            if (!data) {
              reject('Verification failed, please Login again.');
            }

            const { roles, name, avatar, introduction } = data;

            // roles must be a non-empty array
            if (!roles || roles.length <= 0) {
              reject('getInfo: roles must be a non-null array!');
            }

            this.$patch({
              name,
              avatar,
              introduction,
              roles
            });
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
    }
  }
});
