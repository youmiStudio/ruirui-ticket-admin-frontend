import { defineStore } from 'pinia';
import { getToken } from '~/utils/auth';
import type { UserState } from './types';
import { login } from '@/api/user';

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
      // const { username, password } = loginForm;
      return new Promise(async (resolve, reject) => {
         const res = await login(loginForm)
         console.log(res);
      });
    }
  }
});
