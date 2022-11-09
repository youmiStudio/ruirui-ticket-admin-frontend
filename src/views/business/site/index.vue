<template>
  <div class="app-container">
    {{dicts?.type.sys_user_sex}}
    </div>
</template>

<script lang="ts" setup>
import useDictTypes from '@/hooks/web/useDictTypes';
const dicts = useDictTypes("sys_user_sex");

</script>

<style lang="scss" scoped></style>
