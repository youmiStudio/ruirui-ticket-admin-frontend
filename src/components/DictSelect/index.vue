<template>
  <el-select v-model="value" v-bind="$attrs">
    <slot name="optionBefore"></slot>
    <el-option v-if="showNormal" label="全部" value=""></el-option>
    <el-option
      v-for="dict in dicts.type[type]"
      :label="dict.label"
      :value="dict.value"
      :key="dict.value"
    ></el-option>
  </el-select>
</template>

<script lang="ts" setup>
import useDictTypes from '@/hooks/web/useDictTypes';

const props = defineProps({
  type: {
    type: String,
    required: true
  },
  modelValue: {
    type: String
  },
  showNormal: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:model-value']);

const dicts = useDictTypes(props.type!);

const value = computed({
  get: () => {
    return props.modelValue!;
  },
  set: (val) => {
    emit('update:model-value', val);
  }
});
</script>

<style lang="scss" scoped></style>
