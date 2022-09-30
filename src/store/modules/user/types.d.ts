type RoleType = string;

declare global {
  declare interface UserStoreState {
    token?: string | null;
    name?: string;
    avatar?: string;
    introduction?: string;
    roles?: RoleType[];
  }
}


export {}