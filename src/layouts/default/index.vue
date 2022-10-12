<template>
  <div :class="classObj" class="app-wrapper">
    <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <Sidebar class="sidebar-container" />
    <div :class="{'hasTagsView':needTagsView}" class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <Navbar />
        <TagsView v-if="needTagsView" />
      </div>
      <AppMain />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store';
import { storeToRefs } from 'pinia';
import { useResizeHandler } from './hooks/resizeHandler';
import { useGlobSettings } from '~/hooks/settings/useGlobSettings';

import Sidebar from './components/Sidebar/index.vue';
import Navbar from './components/Navbar.vue';
import TagsView from './components/TagsView/index.vue';
import AppMain from './components/AppMain.vue';

useResizeHandler();

const appStore = useAppStore();
const { sidebar, device } = storeToRefs(appStore);
const globSettings = useGlobSettings();

const showSettings = computed(()=>{
  return globSettings.showSettings
})

const needTagsView = computed(()=>{
  return globSettings.tagsView
})

const fixedHeader = computed(()=>{
  return globSettings.fixedHeader
})

const classObj = computed(() => {
  return {
    hideSidebar: !sidebar.value.opened,
    openSidebar: sidebar.value.opened,
    withoutAnimation: sidebar.value.withoutAnimation,
    mobile: device.value === 'mobile'
  };
});

function handleClickOutside() {
  appStore.closeSideBar({ withoutAnimation: false });
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';
@import '@/styles/variables.module.scss';

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
