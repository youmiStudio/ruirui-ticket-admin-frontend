<template>
  <template v-if="icon">
    <template v-if="icon.includes('el-icon')">
      <i class="icon sub-el-icon" />
    </template>
    <template v-else>
      <svg-icon :icon-class="icon" />
    </template>
  </template>
  <template v-if="title">
    <span slot="title">{{title}}</span>
  </template>
</template>

<script lang="ts" setup>
const props = defineProps({
  icon: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  }
});

const { icon, title } = props;
</script>

<style scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
</style>
