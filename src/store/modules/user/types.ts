export type RoleType = string;

export interface UserState {
  token?: string | null;
  name?: string;
  avatar?: string;
  introduction?: string;
  roles?: RoleType[];
}
