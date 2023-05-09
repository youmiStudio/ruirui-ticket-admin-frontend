<template>
  <div class="dashboard-container">
    <component :is="currentRole"></component>
  </div>
</template>

<script lang="ts" setup name="Dashboard">
import AdminDashboard from './admin/index.vue';
import EditorDashboard from './editor/index.vue';
import { useUserStore } from '@/store';
import { storeToRefs } from 'pinia';
import { DefineComponent } from 'vue';
import { RoleEnum } from '~/enums/roleEnum';

const userStore = useUserStore();
const userStoreRefs = storeToRefs(userStore);

const roles = unref<string[] | undefined>(userStoreRefs.roles);
const currentRole = shallowRef<DefineComponent<{}, {}, any>>(AdminDashboard);

// onMounted(() => {
//   if (roles && !roles.includes(RoleEnum.ADMIN)) {
//     currentRole.value = EditorDashboard;
//   }
// });
</script>
