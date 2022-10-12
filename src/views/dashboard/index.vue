<template>
  <div class="dashboard-container">
    <component :is="currentRole"></component>
  </div>
</template>

<script lang="ts" setup name="Dashboard">
import AdminDashboard from './admin/index.vue';
import EditorDashboard from './admin/index.vue';
import { useUserStore } from '@/store';
import { storeToRefs } from 'pinia';
import { DefineComponent } from 'vue';

const userStore = useUserStore();
const userStoreRefs = storeToRefs(userStore);

const roles = unref<string[] | undefined>(userStoreRefs.roles);
const currentRole = shallowRef<DefineComponent<{}, {}, any>>(AdminDashboard);

onBeforeMount(() => {
  if (roles && !roles.includes('admin')) {
    currentRole.value = EditorDashboard;
  }
});
</script>
