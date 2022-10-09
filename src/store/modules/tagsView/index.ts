import { defineStore } from 'pinia';

export const useTagsViewStore = defineStore({
  id: 'tagsView',
  state: (): TagsViewStoreState => ({
    visitedViews: [],
    cachedViews: []
  }),
  getters: {
    visitedViews: (state) => state.visitedViews,
    cachedViews: (state) => state.cachedViews
  },
  actions: {
    addView(view: RouteItem) {
      this.addVisitedView(view);
      this.addCachedView(view);
    },
    addVisitedView(view: RouteItem) {
      if (this.visitedViews.some((v) => v.path === view.path)) return;
      this.visitedViews.push(
        Object.assign({}, view, {
          title: (view.meta && view.meta.title) || 'no-name'
        })
      );
    },
    addCachedView(view: RouteItem) {
      if (this.cachedViews.includes(view.name)) return;
      if (view.meta && !view.meta.noCache) {
        this.cachedViews.push(view.name);
      }
    },

    delView(view: RouteItem) {
      return new Promise((resolve) => {
        this.delVisitedView(view);
        this.delCachedView(view);
        resolve({
          visitedViews: [...this.visitedViews],
          cachedViews: [...this.cachedViews]
        });
      });
    },
    delVisitedView(view: RouteItem) {
      return new Promise((resolve) => {
        for (const [i, v] of this.visitedViews.entries()) {
          if (v.path === view.path) {
            this.visitedViews.splice(i, 1);
            break;
          }
        }
        resolve([...this.visitedViews]);
      });
    },
    delCachedView(view: RouteItem) {
      return new Promise((resolve) => {
        const index = this.cachedViews.indexOf(view.name);
        index > -1 && this.cachedViews.splice(index, 1);
        resolve([...this.cachedViews]);
      });
    },

    delOthersViews(view: RouteItem) {
      return new Promise((resolve) => {
        this.delOthersVisitedViews(view);
        this.delOthersCachedViews(view);
        resolve({
          visitedViews: [...this.visitedViews],
          cachedViews: [...this.cachedViews]
        });
      });
    },
    delOthersVisitedViews(view: RouteItem) {
      return new Promise((resolve) => {
        this.visitedViews = this.visitedViews.filter((v) => {
          return (v.meta && v.meta.affix) || v.path === view.path;
        });
        resolve([...this.visitedViews]);
      });
    },
    delOthersCachedViews(view: RouteItem) {
      return new Promise((resolve) => {
        const index = this.cachedViews.indexOf(view.name);
        if (index > -1) {
          this.cachedViews = this.cachedViews.slice(index, index + 1);
        } else {
          // if index = -1, there is no cached tags
          this.cachedViews = [];
        }
        resolve([...this.cachedViews]);
      });
    },

    delAllViews(view: RouteItem) {
      return new Promise((resolve) => {
        this.delAllVisitedViews();
        this.delAllCachedViews()
        resolve({
          visitedViews: [...this.visitedViews],
          cachedViews: [...this.cachedViews]
        });
      });
    },
    delAllVisitedViews() {
      return new Promise((resolve) => {
        // keep affix tags
        const affixTags = this.visitedViews.filter((tag) => tag.meta && tag.meta.affix);
        this.visitedViews = affixTags;
        resolve([...this.visitedViews]);
      });
    },
    delAllCachedViews() {
      return new Promise((resolve) => {
        this.cachedViews = []
        resolve([...this.cachedViews]);
      });
    },

    updateVisitedView(view: RouteItem) {
      for (let v of this.visitedViews) {
        if (v.path === view.path) {
          v = Object.assign(v, view)
          break
        }
      }
    }
  }
});
