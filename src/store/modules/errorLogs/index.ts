import { defineStore } from 'pinia';

export const useErrorLogsStore = defineStore({
  id: 'errorLogs',
  state: (): ErrorLogsStoreState => ({
    logs: []
  }),
  getters: {},
  actions: {
    addErrorLog(log: ErrorLogs) {
      this.logs.push(log);
    },
    clearErrorLog() {
      this.logs.splice(0)
    }
  }
});
