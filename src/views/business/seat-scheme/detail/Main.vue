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
      :key="parentScale"
      @dragover.prevent
      @drop="onDrop"
    >
      <Dragger
        conflict
        parent
        class="absolute"
        v-for="seat in positionList"
        :key="seat.seatSchemePositionId"
        :lockAspectRatio="true"
        :init-w="seat.size.width ? seat.size.width : seatConfig.iconSize.width"
        :init-h="
          seat.size.height ? seat.size.height : seatConfig.iconSize.height
        "
        :parent-scale-x="parentScale"
        :parent-scale-y="parentScale"
        v-model:x="seat.positionData.x"
        v-model:y="seat.positionData.y"
        v-model:w="seat.size.width"
        v-model:h="seat.size.height"
        @click="onClick(seat)"
        @contextmenu="onContextMenu($event, seat)"
      >
        <img
          class="w100% h100% border border-dashed"
          :src="defaultIcon"
          alt=""
        />
        <div>
          <span class="text-center">{{ seat.name }}</span>
        </div>
      </Dragger>
      <img
        v-show="carPlaneImage"
        class="w100% h100% pointer-events-none"
        :src="carPlaneImage"
      />
    </div>
  </main>
</template>

<script lang="ts" setup>
import { Back } from '@element-plus/icons-vue';
import { useGlobSettings } from '@/hooks/settings/useGlobSettings';
import useSeatConfig from '../hooks/useSeatConfig';
import { ElMessage, ElMessageBox } from 'element-plus';

import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css';
import ContextMenu from '@imengyu/vue3-context-menu';
import Dragger from '~/components/Vue3DraggableResizable';
import { useSeatSchemeStore } from '@/store';

import type {
  Position,
  SeatPosition,
  SeatSize,
  CollisionPostion,
  ParentSize
} from '../types';
import { storeToRefs } from 'pinia';
import { useDebounceFn } from '@vueuse/shared';
import { SeatVo } from '~/api/business/seat/types';

const seatConfig = useSeatConfig;
const seatSchemeStore = useSeatSchemeStore();

const parentRef = ref<HTMLElement>();

type ImageSize = {
  width: number;
  height: number;
};

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
    func: useDebounceFn(onResize, 100)
  }
];

let seatImageSize = ref<ImageSize>({
  width: -1,
  height: -1
});

const { positionList, carPlaneImage, defaultIcon, currentParentSize } =
  storeToRefs(seatSchemeStore);
const currentSeatPosition = ref<SeatPosition>();

const offsetWidth = computed(() => {
  const width = document.body.offsetWidth - 330;
  return Math.abs(width / seatImageSize.value.width) > 0.7
    ? width * 0.7
    : width;
});

const parentScale = computed(() => {
  if (seatImageSize.value.width === -1) {
    return 1;
  }
  return offsetWidth.value / seatImageSize.value.width;
});

watch(carPlaneImage, (value, oldValue) => {
  if (value) {
    pageInit();
  }
});

watch(currentParentSize, () => {
  seatSchemeStore.calcSeatXYByCurParentSize();
});

onMounted(() => {
  pageInit();
});

onBeforeUnmount(() => {
  removeEvents();
});

function pageInit() {
  nextTick(async () => {
    getImageSize(carPlaneImage.value).then((res) => {
      seatImageSize.value = {
        width: res.width,
        height: res.height
      };
      setParentSize();
      registerEvents();
    });
  });
}

function getImageSize(url: string): Promise<ImageSize> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    };
  });
}

function onContextMenu(e: MouseEvent, seat: SeatPosition) {
  e.preventDefault();
  ContextMenu.showContextMenu({
    theme: 'flat',
    x: e.x,
    y: e.y,
    items: [
      {
        label: '修改名称',
        onClick: () => {
          ElMessageBox.prompt('', '修改名称', {
            confirmButtonText: '修改',
            cancelButtonText: '取消',
            inputValue: seat.name
          })
            .then(({ value }) => {
              seat.name = value;
            })
            .catch(() => {});
        }
      },
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
  setParentSize();
}

async function setParentSize() {
  const parentSize = await getParentSize();
  seatSchemeStore.setParentSize(parentSize);
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
  // if (e.key === 'Backspace') {
  //   if (currentSeatPosition.value) {
  //     removeSeat(currentSeatPosition.value);
  //   }
  // }
}

function onClick(seat: SeatPosition) {
  currentSeatPosition.value = seat;
}

function removeSeat(seatPosition: SeatPosition) {
  seatSchemeStore.deleteSeatPosition(seatPosition.seatSchemePositionId!);
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

function onDrop(e: DragEvent) {
  const { offsetX, offsetY } = e;
  if (e.dataTransfer) {
    const seatData = e.dataTransfer.getData('seat');
    const seatDataJson = JSON.parse(seatData);

    addPosition(seatDataJson, {
      x: offsetX - seatConfig.iconSize.width / 2,
      y: offsetY - seatConfig.iconSize.height / 2
    });
  }
}

async function addPosition(seatData: SeatVo, position: Position) {
  const { width: parentWidth, height: parentHeight } = await getParentSize();

  const initSize = {
    width: seatConfig.iconSize.width,
    height: seatConfig.iconSize.height,
    parentScale: parentScale.value,
    parentWidth,
    parentHeight
  };

  const seatPosition: SeatPosition = {
    name: seatData.seatName,
    seatId: seatData.seatId!,
    price: seatData.price as number,
    positionData: position,
    size: initSize
  };

  seatSchemeStore.addSeatPosition(seatPosition);
}

function goBack() {
  $router.push('/ticket/seat-scheme');
}
</script>

<style lang="scss" scoped>
.main {
  background-color: #f6f8fb;
}
</style>
