<template>
  <div>
    <i-frame :src="url"></i-frame>
  </div>
</template>

<script lang="ts" setup>
import IFrame from '@/components/IFrame/index.vue';
import { useGlobSettings } from '@/hooks/settings/useGlobSettings';
const globSettings = useGlobSettings();
const url = ref<string>(globSettings.apiUrl + '/druid/login.html');
</script>

<style lang="scss" scoped></style>
