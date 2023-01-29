<template>
  <div class="seat-list">
    <el-row :gutter="10">
      <el-col
        class="mb-10px"
        v-for="seat in data"
        :index="seat.seatId"
        :span="24"
      >
        <div
          class="seat seat-button flex items-center justify-between select-none"
          draggable="true"
          @mouseenter="handleMouseEnter(seat)"
          @mousedown="handleMouseDown($event, seat)"
          @dragstart="handleDragStart($event)"
        >
          <span class="text-center flex-1"
            >{{ seat.seatName }} | ¥{{ fenToYuan(seat.price) }}</span
          >
          <img
            class="w-20px h-20px pointer-events-none"
            :src="seat.unSelectedIcon"
          />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import type { SeatVoOfCarConfig } from '@/api/business/seat/types';
import { PropType } from 'vue';
import useSeatConfig from '../hooks/useSeatConfig';
import { fenToYuan } from '@/utils/price';

const props = defineProps({
  data: {
    require: true,
    type: Array as PropType<SeatVoOfCarConfig[]>
  }
});
const emit = defineEmits(['mouseDown']);

const config = useSeatConfig;

let previewImage = ref<HTMLImageElement>(
  new Image(config?.iconSize.width, config?.iconSize.height)
);
const currentSeat = ref<SeatVoOfCarConfig>();

function handleMouseEnter(seat: SeatVoOfCarConfig) {
  const previewImageDiv = document.querySelector('.preview-image');
  if (!previewImageDiv) {
    previewImage.value.src = seat.unSelectedIcon;
    previewImage.value.style['position'] = 'absolute';
    previewImage.value.style['top'] = '-9999px';
    previewImage.value.className = 'preview-image';
    document.body.appendChild(previewImage.value);
  } else {
    previewImageDiv.setAttribute('src', seat.unSelectedIcon);
  }
}

function handleMouseDown(ev: MouseEvent, seat: SeatVoOfCarConfig) {
  const seatData = {
    ...seat,
    mousePosition: {
      offsetX: ev.offsetX,
      offsetY: ev.offsetY
    }
  };

  currentSeat.value = seatData;

  emit('mouseDown', seatData);
}

function handleDragStart(ev: DragEvent) {
  const previewImageDiv = document.querySelector('.preview-image');
  if (ev.dataTransfer && config) {
    ev.dataTransfer.setData('seat', JSON.stringify(currentSeat.value));
    ev.dataTransfer.setDragImage(
      previewImageDiv as Element,
      config.iconSize.width / 2,
      config.iconSize.height / 2
    );
  }
}
</script>

<style lang="scss" scoped>
.seat-button {
  padding: 6px 8px;
  color: #409eff;
  font-size: 12px;
  background: #ecf5ff;
  border: 1px #b3d8ff solid;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background: rgba(#ecf5ff, 0.85);
  }
}
</style>
