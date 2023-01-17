<template>
  <div class="app-continaer h100% flex">
    <aside class="aside w240px shrink-0"> </aside>
    <main class="main flex-1 relative flex justify-center items-center overflow-hidden">
      <div class="back absolute top-15px left-30px">
        <el-button size="large" circle :icon="Back" @click="goBack"></el-button>
      </div>

      <div
        class="carSeatArea pointer-events-none select-none"
        :style="{
          width: `${seatImageSize.width}px`,
          height: `${seatImageSize.height}px`,
          transform: `translateY(-3rem) scale(calc(${offsetWidth} / ${seatImageSize.width})) rotate(0deg)`,
        }"
      >
        <img class="w100% h100%" :src="globSettings.apiUrl + seatImageUrl" />
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { Back } from '@element-plus/icons-vue';
import { getCar } from '@/api/business/car';
import { useGlobSettings } from '~/hooks/settings/useGlobSettings';
const globSettings = useGlobSettings();

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

const offsetWidth = (document.body.offsetWidth - 240) * 0.7;

onMounted(() => {
  getCarInfo();
});

function getCarInfo() {
  const carId = $route.params.carId;
  getCar(Number(carId)).then((res) => {
    const { data } = res;
    if (data) {
      seatImageUrl.value = data.carSeatImage;
      getImageSize(data.carSeatImage).then((imgSize) => {
        seatImageSize.value = imgSize;
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

function goBack() {
  $router.go(-1);
}
</script>

<style lang="scss" scoped>
.main {
  background-color: #f6f8fb;
}
</style>
