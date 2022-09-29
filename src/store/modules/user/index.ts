import { defineStore } from 'pinia';
import { getToken } from '~/utils/auth';
import type { UserState } from './types';
import type { UserRequestParams } from '~/api/user/types';

export const useUserStore = defineStore({
  id: 'user',
  state: (): UserState => ({
    token: getToken(),
    name: '',
    avatar: '',
    introduction: '',
    roles: []
  }),
  getters: {},
  actions: {
    // user login
    login(loginForm: UserRequestParams) {
      const { username, password } = loginForm;
      return new Promise((resolve, reject) => {
        console.log(username);
        console.log(password);
      });
    }
  }
});
