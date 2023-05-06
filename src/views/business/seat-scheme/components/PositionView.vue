<template>
  <div class="relative" ref="rootRef">
    <el-image :src="image" @load="imageOnLoad"></el-image>
    <div class="seat-list">
      <img
        class="seat"
        v-for="item in _positions"
        :src="icon"
        :style="{
          width: `${item.sizeData!.width}px`,
          height: `${item.sizeData!.height}px`,
          top:`${item.positionData.y}px`,
          left:`${item.positionData.x}px`,
        }"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import { SeatPosition } from '../types';
import { useDebounceFn } from '@vueuse/shared';
import { deepClone } from '~/utils';

const props = defineProps({
  image: {
    type: String,
    require: true
  },
  icon: {
    type: String,
    require: true
  },
  positions: {
    type: Array as PropType<SeatPosition[]>,
    require: true
  }
});

const _positions = ref<SeatPosition[]>([]);
const rootRef = ref<HTMLElement>();
const currentParentSize = ref<{ width: number; height: number }>({
  width: -1,
  height: -1
});

const events = [
  {
    el: window,
    handle: 'addEventListener',
    type: 'resize',
    func: useDebounceFn(onResize, 50)
  }
];

watch(
  () => props.positions,
  () => {
    getPositions();
  },
  { deep: true }
);

watch(
  () => currentParentSize.value,
  () => {
    calcSeatXYByCurParentSize();
  },
  { deep: true }
);

onMounted(() => {});

const imageOnLoad = () => {
  pageInit();
  getPositions()
};

const getPositions = () => {
  const arr = props.positions;
  if (!arr || arr.length === 0) {
    _positions.value = [];
  }
  _positions.value = deepClone(arr);

  setParentSize();
  calcSeatXYByCurParentSize();
};

function pageInit() {
  setParentSize();
  registerEvents();
}

async function onResize() {
  setParentSize();
}

function setParentSize() {
  getParentSize().then((data) => {
    currentParentSize.value.width = data.width;
    currentParentSize.value.height = data.height;
  });
}

function registerEvents() {
  events.forEach((event) => {
    event.el[event.handle](event.type, event.func);
  });
}

function calcSeatXYByCurParentSize() {
  const { width: cpw, height: cph } = currentParentSize.value;

  _positions.value.forEach((item) => {
    const { sizeData, positionData } = item;
    if (!sizeData) return;
    const { parentWidth: pw, parentHeight: ph } = sizeData;
    const wScale = cpw / pw;

    if (!item.firstPositionData && !item.firstSize) {
      item.firstPositionData = { ...positionData };
      item.firstSize = { ...sizeData! };
    }

    item.sizeData!.width = item.firstSize?.width! * wScale;
    item.sizeData!.height = item.firstSize?.height! * wScale;
    item.positionData.x = item.firstPositionData?.x! * wScale;
    item.positionData.y = item.firstPositionData?.y! * wScale;
  });
}

function getParentSize(): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const next = () => {
      if (!rootRef.value) return;
      const style = window.getComputedStyle(rootRef.value);
      if (parseFloat(style.getPropertyValue('width')) === 0) {
        setTimeout(() => {
          next();
        }, 50);
      } else {
        resolve({
          width: parseFloat(style.getPropertyValue('width')),
          height: parseFloat(style.getPropertyValue('height'))
        });
      }
    };
    next();
  });
}
</script>

<style lang="scss" scoped>
.seat-list {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.seat {
  position: absolute;
  z-index: 10;
}
</style>
