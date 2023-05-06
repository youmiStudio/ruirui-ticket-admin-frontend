<template>
  <div>
    <component
      :is="constructor"
      v-bind="$attrs"
      v-model="value"
      @success="handleUploadSuccess"
    ></component>
  </div>
</template>

<script lang="ts" setup>
import Multiple from './src/multiple.vue'
import Item from './src/item.vue'
import { PropType } from 'vue';
import { Gallery } from './types';

const props = defineProps({
  multiple: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: [String, Array<Gallery>]
  }
});

const emit = defineEmits(['update:modelValue', 'success']);

const constructor = computed({
  get: () => {
    const file = props.multiple ? Multiple : Item;
    return file
  },
  set: () => {}
});

const value = computed({
  get: () => {
    return props.modelValue;
  },
  set: (value) => {
    emit('update:modelValue', value);
  }
});

const handleUploadSuccess = (data: any) => {
  emit('success', data);
};
</script>

<style lang="scss" scoped></style>
