import type {
  RouteRecordRaw,
  RouteMeta,
  RouteLocationNormalizedLoaded,
  RouteLocationRaw,
  LocationQueryRaw,
  RouteLocationPathRaw,
  RouteLocationNamedRaw
} from 'vue-router';
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
    title?: string;
    alwaysShow?: boolean;
    hidden?: boolean;
    meta?: RouteMeta;
    children?: RouteItem[];
    noShowingChildren?: boolean;
    fullPath?: string;
    path?: string;
    query?: LocationQueryRaw;
  } & RouteRecordRaw;
}

export {};
