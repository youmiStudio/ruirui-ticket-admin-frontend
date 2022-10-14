<template>
  <div>
    <div style="margin-bottom: 15px"> Your roles: {{ roles }} </div>
    Switch roles:
    <el-radio-group v-model="switchRoles">
      <el-radio-button label="editor" />
      <el-radio-button label="admin" />
    </el-radio-group>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store';
import { storeToRefs } from 'pinia';

const $emit = defineEmits(["change"])

const userStore = useUserStore();
const { roles } = storeToRefs(userStore);

const switchRoles = computed<string>({
  get: () => {
    const rolesArr = roles && roles.value;
    if (!rolesArr) return '';
    return rolesArr[0];
  },
  set: async (val) => {
    await userStore.changeRoles(val);
    $emit('change')
  }
});
</script>
