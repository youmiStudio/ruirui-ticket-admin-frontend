<template>
  <div class="date-picker">
    <div
      class="date-picker-item"
      :class="{ active: activeIndex === item.id }"
      v-for="(item, index) in list"
      :key="index"
      @click="onClick(item)"
    >
      <div class="date-picker-item__inner">
        <span>{{ item.label }}</span>
        <el-date-picker
          v-if="item.type === 'date'"
          v-model="pickDate"
          type="daterange"
          value-format="YYYY-MM-DD"
          :disabled-date="item.disabledDate"
          @change="datePickerOnChange(item, $event)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';
import type { DatePickerItem } from './types';

const emit = defineEmits<{
  (e: 'click', data: DatePickerItem): void;
}>();

const props = defineProps({
  data: {
    type: Array as PropType<DatePickerItem[]>,
    required: true
  }
});

const activeIndex = ref(0);
const pickDate = ref<string>();

const list = computed<DatePickerItem[]>(() => {
  return [...props.data].map((item, index) => {
    item.id = index;
    return { ...item };
  });
});

onMounted(() => {
  list.value.forEach((item) => {
    if (item.default && !activeIndex.value && item.id) {
      changeActiveIndex(item.id);
    }
  });
  const activeItem = list.value.find((item) => item.id === activeIndex.value);
  if (activeItem) {
    emitClickEvent(activeItem);
  }
});

function changeActiveIndex(id: any) {
  activeIndex.value = id;
}

function emitClickEvent(item: DatePickerItem) {
  emit('click', item);
}

function onClick(item: DatePickerItem) {
  if (activeIndex.value === item.id) return;
  if (item.type === 'text') {
    changeActiveIndex(item.id);
    emitClickEvent(item);
  }
}

function datePickerOnChange(item: DatePickerItem, value: string[]) {
  changeActiveIndex(item.id);
  emitClickEvent({ ...item, pickDate: value });
}
</script>

<style lang="scss" scoped>
.date-picker-item {
  display: inline-block;
  font-size: 12px;
  line-height: 12px;
  color: rgba(0, 0, 0, 0.8);
  border: 1px solid #adadad;
  border-radius: 3px;
  margin-left: 8px;
  cursor: pointer;
  user-select: none;
  &:hover {
    color: #1975ff;
    border-color: #1975ff;
  }
  &.active {
    color: #1975ff;
    border-color: #1975ff;
  }
}
.date-picker-item__inner {
  position: relative;
  padding: 6px 20px;

  :deep(.el-date-editor) {
    z-index: 2;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    // opacity: 0;
  }

  :deep(.el-input__wrapper) {
    display: flex;
    padding: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    .el-input__inner {
      cursor: pointer;
    }
  }
}
</style>
