<template>
  <div v-if="!item.hidden" style="margin:10px 0;">
    <template
      v-if="
        hasOneShowingChild(item.children, item as RouteItem) &&
        (onlyOneChild && !onlyOneChild.children || onlyOneChild && onlyOneChild.noShowingChildren) &&
        !item.alwaysShow
      "
    >
      <Link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item
          :index="resolvePath(onlyOneChild.path)"
          :class="{ 'submenu-title-noDropdown': !isNest }"
        >
          <template
            v-if="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"
          >
            <svg-icon
              :icon-class="
                onlyOneChild.meta.icon || (item.meta && item.meta.icon)
              "
            />
          </template>
          <template #title>
            <span slot="title">{{ onlyOneChild.meta.title }}</span>
          </template>
        </el-menu-item>
      </Link>
    </template>

    <el-sub-menu v-else ref="subMenu" :index="resolvePath(item.path)">
      <template #title>
        <template v-if="item.meta && item.meta.icon">
          <svg-icon :icon-class="item.meta && item.meta.icon" />
        </template>
        <span>{{ item.meta.title }}</span>
      </template>
      <SidebarItem
          v-for="child in item.children"
          :key="child.path"
          :is-nest="true"
          :item="child"
          :base-path="resolvePath(child.path)"
          class="nest-menu"
        />
    </el-sub-menu>
  </div>
</template>

<script lang="ts" setup>
import { isExternal } from '@/utils/validate';
import { Ref } from 'vue';
import path from 'path-browserify';
import Item from './Item.vue';
import Link from './Link.vue';

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  isNest: {
    type: Boolean,
    default: false
  },
  basePath: {
    type: String,
    default: ''
  }
});

const { basePath } = props;

const onlyOneChild: Ref<RouteItem | null> = ref(null);

function hasOneShowingChild(children: RouteItem[] = [], parent: RouteItem) {
  const showingChildren = children.filter((item) => {
    if (item.hidden) {
      return false;
    } else {
      // Temp set(will be used if only has one showing child)
      onlyOneChild.value = item;
      return true;
    }
  });

  // When there is only one child router, the child router is displayed by default
  if (showingChildren.length === 1) {
    return true;
  }

  // Show parent if there are no child router to display
  if (showingChildren.length === 0) {
    onlyOneChild.value = { ...parent, path: '', noShowingChildren: true };
    return true;
  }

  return false;
}
function resolvePath(routePath: string) {
  if (isExternal(routePath)) {
    return routePath;
  }
  if (isExternal(basePath)) {
    return basePath;
  }
  return path.resolve(basePath, routePath);
}
</script>
