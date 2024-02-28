<template>
  <div class="app-container">
    <live-data></live-data>
    <flows-data></flows-data>
    <order-data></order-data>
    <write-off-log-data></write-off-log-data>
  </div>
</template>

<script lang="ts" setup>
import LiveData from './components/LiveData.vue';
import OrderData from './components/OrderData.vue';
import FlowsData from './components/FlowsData.vue';
import WriteOffLogData from './components/WriteOffLogData.vue'
</script>

<style lang="scss" scoped></style>
