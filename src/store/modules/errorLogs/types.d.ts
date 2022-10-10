declare global {
  declare type ErrorLogs = {
    err: Error;
    vm: Vue;
    info: string;
    url: string;
  };

  declare interface ErrorLogsStoreState {
    logs: errorLogs[];
  }
}

export {};
