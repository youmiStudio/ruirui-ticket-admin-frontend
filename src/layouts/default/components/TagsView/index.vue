<template>
  <div ref="$el" id="tags-view-container" class="tags-view-container">
    <scroll-pane ref="scrollPane" class="tags-view-wrapper">
      <router-link
        v-for="tag in visitedViews"
        ref="tag"
        :key="tag.path"
        :class="isActive(tag) ? 'active' : ''"
        :to="{ path: tag.path, query: tag.query }"
        tag="span"
        class="tags-view-item"
        @click.middle.native="!isAffix(tag) ? closeSelectedTag(tag) : ''"
        @contextmenu.prevent.native="openMenu(tag, $event)"
      >
        {{ tag.title }}
        <span
          v-if="!isAffix(tag)"
          class="el-icon-close"
          @click.prevent.stop="closeSelectedTag(tag)"
        >
          <el-icon>
            <i-ep-close></i-ep-close>
          </el-icon>
        </span>
      </router-link>
    </scroll-pane>
    <ul
      v-show="visible"
      :style="{ left: $left + 'px', top: $top + 'px' }"
      class="contextmenu"
    >
      <li @click="refreshSelectedTag(selectedTag)">Refresh</li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)"
        >Close</li
      >
      <li @click="closeOthersTags">Close Others</li>
      <li @click="closeAllTags(selectedTag)">Close All</li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { _RouterLinkI, RouteLocationRaw } from 'vue-router';
import ScrollPane from './ScrollPane.vue';
import path from 'path-browserify';
import { usePermissionStore, useTagsViewStore } from '@/store';
import { storeToRefs } from 'pinia';

const permissionStore = usePermissionStore();
const tagsViewStore = useTagsViewStore();
const { routes } = storeToRefs(permissionStore);
const { visitedViews } = storeToRefs(tagsViewStore);

const $route = useRoute();
const $router = useRouter();

const tag = ref<InstanceType<_RouterLinkI>>();
const scrollPane = ref();

const visible = ref<boolean>(false);
const $el = ref<HTMLDivElement>();
const $top = ref<number>(0);
const $left = ref<number>(0);
const selectedTag = ref<VisitedViews>({} as VisitedViews);
const affixTags = ref<VisitedViews[]>([]);

watch(
  $route,
  () => {
    addTags();
    moveToCurrentTag();
  },
  { immediate: true }
);

watch(visible, (value) => {
  if (value) {
    document.body.addEventListener('click', closeMenu);
  } else {
    document.body.removeEventListener('click', closeMenu);
  }
});

function isActive(route: RouteItem) {
  return route.path === $route.path;
}

function isAffix(tag: VisitedViews) {
  return tag.meta && tag.meta.affix;
}

function filterAffixTags(routes: RouteItem[], basePath = '/'): VisitedViews[] {
  let tags: VisitedViews[] = [];
  routes.forEach((route) => {
    if (route.meta && route.meta.affix) {
      const tagPath = path.resolve(basePath, route.path);
      const tag = {
        fullPath: tagPath,
        path: tagPath,
        name: route.name,
        meta: { ...route.meta }
      } as VisitedViews;
      tags.push(tag);
    }
    if (route.children) {
      const tempTags = filterAffixTags(route.children, route.path);
      if (tempTags.length >= 1) {
        tags = [...tags, ...tempTags];
      }
    }
  });
  return tags;
}

function initTags() {
  const affixTagsArr = (affixTags.value = filterAffixTags(routes.value));
  for (const tag of affixTagsArr) {
    // Must have tag name
    if (tag.name) {
      tagsViewStore.addVisitedView(tag);
    }
  }
}

function addTags() {
  const { name } = $route;
  if (name) {
    // this.$store.dispatch('tagsView/addView', $route)
    tagsViewStore.addView($route as any);
  }
  return false;
}

function moveToCurrentTag() {
  const tags = tag.value;
  nextTick(() => {
    if (tags) {
      for (const tag of tags as any) {
        if (tag.to.path === $route.path) {
          scrollPane.value.moveToTarget(tag);
          // when query is different then update
          if (tag.to.fullPath !== $route.fullPath) {
            tagsViewStore.updateVisitedView($route as any);
          }
          break;
        }
      }
    }
  });
}

function refreshSelectedTag(view: VisitedViews) {
  tagsViewStore.delCachedView(view).then(() => {
    const { fullPath } = view;
    nextTick(() => {
      $router.replace({
        path: '/redirect' + fullPath
      });
    });
  });
}

function closeSelectedTag(view: VisitedViews) {
  tagsViewStore.delView(view).then((res) => {
    const { visitedViews } = res;
    if (isActive(view)) {
      toLastView(visitedViews, view);
    }
  });
}

function closeOthersTags() {
  if (selectedTag.value) {
    $router.push(selectedTag.value);
    tagsViewStore.delOthersViews(selectedTag.value).then(() => {
      moveToCurrentTag();
    });
  }
}

function closeAllTags(view: VisitedViews) {
  tagsViewStore.delAllViews().then((res) => {
    const { visitedViews } = res;
    if (affixTags.value.some((tag) => tag.path === view.path)) {
      return;
    }
    toLastView(visitedViews, view);
  });
}

function toLastView(visitedViews: VisitedViews[], view: VisitedViews) {
  const latestView = visitedViews.slice(-1)[0];
  if (latestView) {
    $router.push(latestView.fullPath as RouteLocationRaw);
  } else {
    // now the default is to redirect to the home page if there is no tags-view,
    // you can adjust it according to your needs.
    if (view.name === 'Dashboard') {
      // to reload home page
      $router.replace({ path: '/redirect' + view.fullPath });
    } else {
      $router.push('/');
    }
  }
}

function openMenu(tag: VisitedViews, e: any) {
  if (!$el.value) return;

  const menuMinWidth = 105;
  const offsetLeft = $el.value.getBoundingClientRect().left; // container margin left
  const offsetWidth = $el.value.offsetWidth; // container width
  const maxLeft = offsetWidth - menuMinWidth; // left boundary
  const left = e.clientX - offsetLeft + 15; // 15: margin right

  if (left > maxLeft) {
    $left.value = maxLeft;
  } else {
    $left.value = left;
  }

  $top.value = e.clientY;
  visible.value = true;
  selectedTag.value = tag;
  console.log(tag);
}

function closeMenu() {
  visible.value = false;
}
function handleScroll() {
  closeMenu();
}
</script>

<style lang="scss" scoped>
.tags-view-container {
  height: 34px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 27px;
      line-height: 25px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 9px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;
      &:first-of-type {
        margin-left: 15px;
      }
      &:last-of-type {
        margin-right: 15px;
      }
      &.active {
        background-color: #42b983;
        color: #fff;
        border-color: #42b983;
        &::before {
          content: '';
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 5px;
        }
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>

<style lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      width: 16px;
      height: 16px;
      // vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;
      &:before,
      .el-icon {
        transform: scale(1);
        display: inline-block;
        vertical-align: -2px;
      }
      &:hover {
        // background-color: #b4bccc;
        // color: #fff;
        color: black;
      }
    }
  }
}
</style>
