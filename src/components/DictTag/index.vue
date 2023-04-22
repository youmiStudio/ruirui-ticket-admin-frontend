<template>
  <div>
    <template v-for="(item, index) in optionsData">
      <template v-if="values.includes(item.value)">
        <span
          v-if="item.raw.listClass === 'default' || item.raw.listClass === ''"
          :key="item.value"
          :index="index"
          :class="item.raw.cssClass"
          >{{ item.label }}</span
        >
        <el-tag
          v-else
          :disable-transitions="true"
          :key="index"
          :type="item.raw.listClass === 'primary' ? '' : item.raw.listClass"
          :class="item.raw.cssClass"
        >
          {{ item.label }}
        </el-tag>
      </template>
    </template>
  </div>
</template>

<script lang="ts" setup name="DictTag">
import useDictTypes from '@/hooks/web/useDictTypes';
const props = defineProps({
  options: {
    type: Array as any,
    default: () => []
  },
  value: [Number, String, Array],
  type: {
    type: String
  }
});
const dicts = useDictTypes(props.type!);

const optionsData = computed(() => {
  if (props.options && props.options.length > 0) {
    return props.options;
  }
  if (props.type) {
    return dicts.type[props.type!];
  }
});

const values = computed(() => {
  if (props.value !== null && typeof props.value !== 'undefined') {
    return Array.isArray(props.value) ? props.value : [String(props.value)];
  } else {
    return [];
  }
});
</script>
<style scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
</style>
