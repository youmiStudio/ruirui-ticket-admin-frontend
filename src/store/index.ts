import { createPinia } from 'pinia';
import { useUserStore } from './modules/user';
import { usePermissionStore } from './modules/permission';

import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

export { useUserStore, usePermissionStore };

export default pinia;
