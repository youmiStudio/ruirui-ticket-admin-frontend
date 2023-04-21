<template>
  <div class="app-continaer h100% flex">
    <config-seat-aside></config-seat-aside>
    <config-seat-main></config-seat-main>
  </div>
</template>

<script lang="ts" setup>
import ConfigSeatAside from './Aside.vue';
import ConfigSeatMain from './Main.vue';

import { useSeatSchemeStore } from '@/store';
import { openLoading, closeLoading } from '@/hooks/web/useLoading';

const route = useRoute();

const seatSchemeId = computed(() => {
  return route.params.seatSchemeId;
});

watch(
  seatSchemeId,
  (id) => {
    if (!id) return;
    openLoading('加载中');
    useSeatSchemeStore().setSeatSchemeId(Number(id))
    useSeatSchemeStore().getSeatScheme()
    closeLoading()
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped></style>
