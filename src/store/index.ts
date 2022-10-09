import { createPinia } from 'pinia';

import { useAppStore } from './modules/app';
import { useUserStore } from './modules/user';
import { usePermissionStore } from './modules/permission';
import { useTagsViewStore } from './modules/tagsView';

import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

export { useAppStore, useUserStore, usePermissionStore, useTagsViewStore };

export default pinia;
