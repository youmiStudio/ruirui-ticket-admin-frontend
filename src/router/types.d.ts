import type { RouteRecordRaw, RouteMeta } from 'vue-router';
import { RoleEnum } from '~/enums/roleEnum';

declare global {
  declare type RouteMeta = {
    title: string;
    icon?: string;
    noCache?: boolean;
    affix?: boolean;
    roles?: RoleEnum[];
  };

  declare type RouteItem = {
    name: string;
    alwaysShow?: boolean;
    hidden?: boolean;
    meta?: RouteMeta;
    children?: RouteItem[];
  } & RouteRecordRaw;
}

export {};
