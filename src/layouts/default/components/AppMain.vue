<template>
  <section class="app-main">
    <router-view :key="key" v-slot="{ Component }">
      <transition name="fade-transform" mode="out-in">
        <keep-alive>
          <suspense>
            <template #default>
              <component :is="Component" />
            </template>
          </suspense>
        </keep-alive>
      </transition>
    </router-view>
  </section>
</template>

<script lang="ts" setup name="AppMain">
import { useTagsViewStore } from '@/store';
import { storeToRefs } from 'pinia';
const tagsViewStore = useTagsViewStore();
const { cachedViews } = storeToRefs(tagsViewStore);
const $route = useRoute();

const key = computed(() => $route.path);
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
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
