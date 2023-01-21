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
    </el-timeline>
  </aside>
</template>

<script lang="ts" setup>
import { useGlobSettings } from '@/hooks/settings/useGlobSettings';
import { seatAllList } from '@/api/business/seat/index';
import type { SeatVoOfCarConfig } from '@/api/business/seat/types';
import SeatList from './SeatList.vue';

const globSettings = useGlobSettings();
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
