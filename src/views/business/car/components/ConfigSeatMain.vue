<template>
  <main class="main flex-1 relative flex justify-center items-center">
    <div class="back absolute top-15px left-30px">
      <el-button size="large" circle :icon="Back" @click="goBack"></el-button>
    </div>

    <div
      ref="parentRef"
      class="car-config-area select-none relative"
      :style="{
        transform: `translateY(-3rem) scale(${parentScale}) rotate(0deg)`
      }"
      @dragover.prevent
      @drop="onDrop"
    >
      <Dragger
        conflict
        parent
        class="absolute"
        v-for="seat in seatList"
        :index="seat.carSeatId"
        :lockAspectRatio="true"
        :init-w="seat.size.width ? seat.size.width : seatConfig.iconSize.width"
        :init-h="
          seat.size.height ? seat.size.height : seatConfig.iconSize.height
        "
        :parent-scale-x="parentScale"
        :parent-scale-y="parentScale"
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

import type {
  Seat,
  SeatPosition,
  SeatSize,
  CollisionPostion,
  ParentSize
} from '../types';
import type { SeatVoOfCarConfig } from '~/api/business/seat/types';
import { storeToRefs } from 'pinia';
import { useDebounceFn } from '@vueuse/shared';

const globSettings = useGlobSettings();
const seatConfig = useSeatConfig;
const configSeatStore = useConfigSeatStore();

const parentRef = ref<HTMLElement>();

type ImageSize = {
  width: number;
  height: number;
};

const $route = useRoute();
const $router = useRouter();

const events = [
  {
    el: document,
    handle: 'addEventListener',
    type: 'keyup',
    func: onKeyUp
  },
  {
    el: window,
    handle: 'addEventListener',
    type: 'resize',
    func: useDebounceFn(onResize, 5)
  }
];

let seatImageSize = ref<ImageSize>({
  width: -1,
  height: -1
});
const seatImageUrl = ref<string>('');

const { seatList } = storeToRefs(configSeatStore);
const currentSeat = ref<Seat>();

const offsetWidth = computed(() => {
  const width = document.body.offsetWidth - 300;
  return Math.abs(width / seatImageSize.value.width) > 0.7
    ? width * 0.7
    : width;
});

const parentScale = computed(() => {
  return offsetWidth.value / seatImageSize.value.width;
});

onMounted(() => {
  nextTick(() => {
    openLoading('页面加载中');
  });

  nextTick(async () => {
    const parentSize = await getParentSize();
    configSeatStore.setParentSize(parentSize);
  });

  getCarInfo();
  registerEvents();

  setTimeout(() => {
    closeLoading();
  }, 200);
});

onBeforeUnmount(() => {
  removeEvents();
});

function getCarInfo() {
  const carId = $route.params.carId;
  getCar(Number(carId)).then((res) => {
    const { data } = res;
    if (data) {
      getImageSize(data.carSeatImage).then(async (imgSize) => {
        seatImageSize.value = imgSize;
        seatImageUrl.value = data.carSeatImage;

        configSeatStore.getSeat();
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

async function onResize() {
  const parentSize = await getParentSize();
  configSeatStore.setParentSize(parentSize);
  configSeatStore.getSeat();
}

function registerEvents() {
  events.forEach((event) => {
    event.el[event.handle](event.type, event.func);
  });
}

function removeEvents() {
  events.forEach((event) => {
    event.handle = 'removeEventListener';
    event.el[event.handle](event.type, event.func);
  });
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

function getParentSize(): Promise<ParentSize> {
  return new Promise((resolve, reject) => {
    const next = () => {
      if (parentRef.value?.offsetWidth === 0) {
        setTimeout(() => {
          next();
        }, 50);
      } else {
        if (!parentRef.value) return;
        const style = window.getComputedStyle(parentRef.value);
        resolve({
          scale: parentScale.value,
          width: parseFloat(style.getPropertyValue('width')),
          height: parseFloat(style.getPropertyValue('height'))
        });
      }
    };
    next();
  });
}

async function addSeat(seatData: SeatVoOfCarConfig, position: SeatPosition) {
  const initDragConfig = {
    axis: 'both'
  };

  const { width: parentWidth, height: parentHeight } = await getParentSize();

  const initSize = {
    width: seatConfig.iconSize.width,
    height: seatConfig.iconSize.height,
    parentScale: parentScale.value,
    parentWidth,
    parentHeight
  };

  const seat: Seat = {
    carSeatId: seatList.value.length + 10,
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
