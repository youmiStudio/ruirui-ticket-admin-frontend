<template>
  <section class="app-main">
    <router-view v-slot="{ Component, route }">
      <suspense>
        <template #default>
          <transition name="fade-transform" mode="out-in">
            <keep-alive :include="cachedViews">
              <component :is="Component" :key="route.path" />
            </keep-alive>
          </transition>
        </template>
      </suspense>
    </router-view>
  </section>
</template>

<script lang="ts" setup name="AppMain">
import { useTagsViewStore } from '@/store';
import { storeToRefs } from 'pinia';
const tagsViewStore = useTagsViewStore();
const { cachedViews } = storeToRefs(tagsViewStore);
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 60px);
  width: 100%;
  position: relative;
  overflow: hidden;
  background-color: #f6f8fb;
}

.fixed-header + .app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header + .app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
