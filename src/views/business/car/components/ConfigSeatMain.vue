<template>
  <main class="main flex-1 relative flex justify-center items-center">
    <div class="back absolute top-15px left-30px">
      <el-button size="large" circle :icon="Back" @click="goBack"></el-button>
    </div>

    <div
      class="car-config-area select-none relative"
      :style="{
        transform: `translateY(-3rem) scale(calc(${offsetWidth} / ${seatImageSize.width})) rotate(0deg)`
      }"
      @dragover.prevent
      @drop="onDrop"
    >
      <Dragger
        conflict
        parent
        class="absolute"
        v-for="seat in seatList"
        :index="seat.nanoid"
        :lockAspectRatio="true"
        :init-w="seatConfig.iconSize.width"
        :init-h="seatConfig.iconSize.height"
        :parent-scale-x="offsetWidth / seatImageSize.width"
        :parent-scale-y="offsetWidth / seatImageSize.width"
        :axis="seat.dragConfig.axis"
        v-model:x="seat.position.x"
        v-model:y="seat.position.y"
        v-model:w="seat.size.width"
        v-model:h="seat.size.height"
        @click="onClick(seat)"
        @contextmenu="onContextMenu($event, seat)"
      >
        <img
          class="w100% h100% border border-dashed"
          :src="seat.unSelectedIcon"
          alt=""
        />
      </Dragger>
      <img
        v-show="seatImageUrl"
        class="w100% h100% pointer-events-none"
        :src="globSettings.apiUrl + seatImageUrl"
      />
    </div>
  </main>
</template>

<script lang="ts" setup>
import { Back } from '@element-plus/icons-vue';
import { getCar } from '@/api/business/car';
import { useGlobSettings } from '@/hooks/settings/useGlobSettings';
import { openLoading, closeLoading } from '@/hooks/web/useLoading';
import useSeatConfig from '../hooks/useSeatConfig';

import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css';
import ContextMenu from '@imengyu/vue3-context-menu';
import Dragger from '~/components/Vue3DraggableResizable';
import { useConfigSeatStore } from '@/store';

import type { Seat, SeatPosition, SeatSize, CollisionPostion } from '../types';
import type { SeatVoOfCarConfig } from '~/api/business/seat/types';
import { storeToRefs } from 'pinia';

const globSettings = useGlobSettings();
const seatConfig = useSeatConfig;
const configSeatStore = useConfigSeatStore();

type ImageSize = {
  width: number;
  height: number;
};

const $route = useRoute();
const $router = useRouter();

let seatImageSize = ref<ImageSize>({
  width: -1,
  height: -1
});
const seatImageUrl = ref<string>('');
const offsetWidth = ref<number>(document.body.offsetWidth - 240);

const { seatList } = storeToRefs(configSeatStore);
const currentSeat = ref<Seat>();

watch(
  seatImageSize,
  (v) => {
    const scaleWidth = offsetWidth.value;
    offsetWidth.value =
      Math.abs(scaleWidth / v.width) > 0.7 ? scaleWidth * 0.7 : scaleWidth;
  },
  { deep: true }
);

onMounted(() => {
  nextTick(() => {
    openLoading('页面加载中');
  });
  getCarInfo();
  registerKeyUp();
  setTimeout(() => {
    closeLoading();
  }, 200);
});

function getCarInfo() {
  const carId = $route.params.carId;
  getCar(Number(carId)).then((res) => {
    const { data } = res;
    if (data) {
      getImageSize(data.carSeatImage).then((imgSize) => {
        seatImageSize.value = imgSize;
        seatImageUrl.value = data.carSeatImage;
      });
    }
  });
}

function getImageSize(url: string): Promise<ImageSize> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = globSettings.apiUrl + url;
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    };
  });
}

function onDrop(e: DragEvent) {
  const { offsetX, offsetY } = e;
  if (e.dataTransfer) {
    const seatData = e.dataTransfer.getData('seat');
    const seatDataJson = JSON.parse(seatData);
    addSeat(seatDataJson, {
      x: offsetX - seatConfig.iconSize.width / 2,
      y: offsetY - seatConfig.iconSize.height / 2
    });
  }
}

function onContextMenu(e: MouseEvent, seat: Seat) {
  e.preventDefault();
  ContextMenu.showContextMenu({
    theme: 'flat',
    x: e.x,
    y: e.y,
    items: [
      {
        label: '删除',
        onClick: () => {
          removeSeat(seat);
        }
      }
    ]
  });
}

function registerKeyUp() {
  document.addEventListener('keyup', onKeyUp);
}

function onKeyUp(e: KeyboardEvent) {
  if (e.key === 'Backspace') {
    if (currentSeat.value) {
      removeSeat(currentSeat.value);
    }
  }
}

function onClick(seat: Seat) {
  currentSeat.value = seat;
}

function removeSeat(seat: Seat) {
  configSeatStore.removeSeat(seat);
}

function addSeat(seatData: SeatVoOfCarConfig, position: SeatPosition) {
  delete seatData.seatId;

  const initDragConfig = {
    axis: 'both'
  };
  const initSize = {
    width: seatConfig.iconSize.width,
    height: seatConfig.iconSize.height,
    parentWidth: offsetWidth.value
  };

  const seat: Seat = {
    ...seatData,
    position,
    dragConfig: initDragConfig,
    size: initSize
  };

  configSeatStore.addSeat(seat);
}

function goBack() {
  $router.go(-1);
}
</script>

<style lang="scss" scoped>
.main {
  background-color: #f6f8fb;
}
</style>
