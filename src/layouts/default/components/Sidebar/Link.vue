<template>
  <component :is="type" v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script lang="ts" setup>
import { isExternal as isExternalFunc } from '@/utils/validate';

const props = defineProps({
  to: {
    type: String,
    required: true
  }
});

const isExternal = computed(() => isExternalFunc(props.to));
const type = computed(() => {
  if (isExternal.value) {
    return 'a';
  }
  return 'router-link';
});

function linkProps(to: string) {
  if (isExternal.value) {
    return {
      href: to,
      target: '_blank',
      rel: 'noopener'
    };
  }
  return {
    to: to
  };
}
</script>
