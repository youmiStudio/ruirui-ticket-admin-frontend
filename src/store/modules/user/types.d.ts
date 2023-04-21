
declare global {
  declare interface UserStoreState {
    token?: string | null;
    name?: string;
    avatar?: string;
    introduction?: string;
    roles?: string[];
    authorities?: string[];
    rasKey:string;
  }
}


export {}