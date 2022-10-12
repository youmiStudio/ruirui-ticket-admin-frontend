<template>
  <div :class="{ 'has-logo': showLogo }"> 
    <Logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <SidebarItem v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import variablesScss from '@/styles/variables.module.scss';
import { useGlobSettings } from '~/hooks/settings/useGlobSettings';
import { useAppStore, usePermissionStore } from '@/store';
import { storeToRefs } from 'pinia';

import Logo from './Logo.vue';
import SidebarItem from './SidebarItem.vue';

const globSetting = useGlobSettings();
const appStore = useAppStore();
const permissionStroe = usePermissionStore();
const route = useRoute();

const { sidebar } = storeToRefs(appStore);
const { routes } = storeToRefs(permissionStroe);

const activeMenu = computed(():string => {
  const { meta, path } = route;
  // if set path, the sidebar will highlight the path you set
  if (meta.activeMenu) {
    return meta.activeMenu;
  }
  return path;
});
const showLogo = computed(() => globSetting.sidebarLogo);
const variables = computed(() => variablesScss);
const isCollapse = computed(() => !sidebar.value.opened);
</script>

<style lang="scss" scoped></style>
