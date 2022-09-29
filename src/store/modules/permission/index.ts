import { defineStore } from 'pinia';

export const usePermissionStore = defineStore({
  id: 'permission',
  state: () => ({
    routes: [],
    addRoutes: []
  }),
  getters: {},
  actions: {}
});
