<template>
  <aside class="aside w300px shrink-0 pt-20px pl-20px pr-20px">
    <el-timeline>
      <el-timeline-item
        timestamp="第一步"
        placement="top"
        size="large"
        color="#C6E2FF"
      >
        <el-card>
          <template #header>
            <span>选择座位</span>
          </template>
          <seat-list :data="seatList"></seat-list>
        </el-card>
      </el-timeline-item>
      <el-timeline-item
        timestamp="第二步"
        placement="top"
        size="large"
        color="#C6E2FF"
      >
        <el-card>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-button round type="danger" @click="handleReset"
                >重置座位</el-button
              >
            </el-col>
            <el-col :span="12">
              <el-button round type="primary" @click="handleSave"
                >保存座位</el-button
              >
            </el-col>
          </el-row>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </aside>
</template>

<script lang="ts" setup>
import { useGlobSettings } from '@/hooks/settings/useGlobSettings';
import { seatAllList } from '@/api/business/seat/index';
import { useConfigSeatStore } from '@/store';
import type { SeatVoOfCarConfig } from '@/api/business/seat/types';
import SeatList from './SeatList.vue';
import { ElMessage } from 'element-plus';

const $route = useRoute();

const globSettings = useGlobSettings();
const configSeatStore = useConfigSeatStore();
const seatList = ref<SeatVoOfCarConfig[]>([]);

onMounted(() => {
  getSeatAllList();
});

function getSeatAllList() {
  seatAllList().then((res) => {
    const { data } = res;
    if (data) {
      seatList.value = data.map((item) => {
        ['boughtIcon', 'selectedIcon', 'unSelectedIcon'].forEach((key) => {
          item[key] = globSettings.apiUrl + item[key];
        });
        return item;
      });
    }
  });
}

async function handleSave() {
  await configSeatStore.saveSeat();
  const carId = $route.params.carId;
  configSeatStore.getSeat(Number(carId));
  ElMessage.success("保存座位成功")
}

function handleReset() {
  configSeatStore.resetSeat();
  const carId = $route.params.carId;
  configSeatStore.getSeat(Number(carId));
}
</script>

<style lang="scss" scoped>
:deep() {
  .el-card__header,
  .el-timeline-item__timestamp {
    text-align: center;
  }
  .el-timeline-item__timestamp {
    margin-bottom: 8px;
  }
}
</style>
