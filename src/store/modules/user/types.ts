export type RoleType = string;

export interface UserState {
  token?: '';
  name?: '';
  avatar?: '';
  introduction?: '';
  roles?: RoleType[];
}
