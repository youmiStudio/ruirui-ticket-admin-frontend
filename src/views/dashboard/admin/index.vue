<template>
  <div class="app-container">
    <live-data></live-data>
    <flows-data></flows-data>
    <order-data></order-data>
  </div>
</template>

<script lang="ts" setup>
import LiveData from './components/LiveData.vue';
import OrderData from './components/OrderData.vue';
import FlowsData from './components/FlowsData.vue';
</script>

<style lang="scss" scoped></style>
