declare global {
  declare interface TagsViewStoreState {
    visitedViews: RouteItem[];
    cachedViews: string[];
  }
}

export {};
