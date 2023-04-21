<template>
  <el-radio-group v-model="value" v-bind="$attrs">
    <el-radio
      v-for="dict in dicts.type[type]"
      :size="size"
      :label="dict.value"
      >{{ dict.label }}</el-radio
    >
  </el-radio-group>
</template>

<script lang="ts" setup>
import useDictTypes from '@/hooks/web/useDictTypes';
import { PropType } from 'vue';

const props = defineProps({
  type: {
    type: String,
    required: true
  },
  modelValue: {
    type: String
  },
  size: {
    type: String as PropType<'large' | 'default' | 'small'>
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
