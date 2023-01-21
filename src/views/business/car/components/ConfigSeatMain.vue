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
      @drop="handleDrop"
    >
      <div
        v-for="seat in seatList"
        :index="seat.seatId"
        class="absolute"
        :style="{
          width: `${seat.size.width}px`,
          height: `${seat.size.height}px`,
          transform: `translate(${seat.position.x}px, ${seat.position.y}px)`
        }"
        @dragstart.prevent
      >
        <img class="w100% h100%" :src="seat.unSelectedIcon" alt="" />
      </div>
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

import type { Seat, SeatPosition } from '../types';
import type { SeatVoOfCarConfig } from '~/api/business/seat/types';
import { transform } from 'lodash';

const globSettings = useGlobSettings();
const seatConfig = useSeatConfig;

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

const seatList = ref<Seat[]>([]);

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

function handleDrop(e: DragEvent) {
  const { offsetX, offsetY } = e;
  if (e.dataTransfer) {
    const seatData = e.dataTransfer.getData('seat');
    const seatDataJson = JSON.parse(seatData);
    addSeat(seatDataJson, {
      x: offsetX - (seatConfig.iconSize.width / 2),
      y: offsetY - (seatConfig.iconSize.height / 2)
    });
  }
}

function addSeat(seatData: SeatVoOfCarConfig, position: SeatPosition) {
  const seat: Seat = {
    ...seatData,
    position,
    size: {
      width: seatConfig.iconSize.width,
      height: seatConfig.iconSize.height
    }
  };

  seatList.value.push(seat);

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
