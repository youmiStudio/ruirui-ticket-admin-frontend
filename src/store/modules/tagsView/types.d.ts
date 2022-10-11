declare global {
  declare type VisitedViews = RouteItem;
  
  declare interface TagsViewStoreState {
    visitedViews: VisitedViews[];
    cachedViews: string[];
  }
}

export {};
