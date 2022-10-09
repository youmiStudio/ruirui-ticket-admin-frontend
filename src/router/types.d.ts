import type { RouteRecordRaw, RouteMeta } from 'vue-router';
import { RoleEnum } from '~/enums/roleEnum';

declare module 'vue-router' {
  interface RouteMeta {
    title: string;
    icon?: string;
    noCache?: boolean;
    affix?: boolean;
    roles?: RoleEnum[];
    activeMenu?: string;
  }
}

declare global {
  declare type RouteItem = {
    name: string;
    alwaysShow?: boolean;
    hidden?: boolean;
    meta?: RouteMeta;
    children?: RouteItem[];
    noShowingChildren?: boolean;
  } & RouteRecordRaw;
}

export {};
