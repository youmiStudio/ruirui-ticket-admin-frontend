<template>
  <aside class="aside w330px shrink-0 pt-20px pl-20px pr-20px overflow-auto ">
    <el-timeline>
      <el-timeline-item
        timestamp="第一步"
        placement="top"
        size="large"
        color="#C6E2FF"
      >
        <el-card>
          <template #header>
            <span>上传座位图标</span>
          </template>
          <el-row :gutter="10">
            <template v-for="item in formSeatIconItems" :key="item.prop">
              <el-col
                class="flex flex-col justify-center items-center"
                :span="8"
              >
                <el-upload
                  class="avatar-uploader mb-10px"
                  :show-file-list="false"
                >
                  <!-- <el-icon class="avatar-uploader-icon"><Plus /></el-icon> -->
                  <img
                    class="avatar"
                    :src="globSettings.apiUrl + item.value"
                    alt=""
                  />
                </el-upload>
                <span>{{ item.label }}</span>
              </el-col>
            </template>
          </el-row>
        </el-card>
      </el-timeline-item>
      <el-timeline-item
        timestamp="第二步"
        placement="top"
        size="large"
        color="#C6E2FF"
      >
        <el-card>
          <template #header>
            <span>上传车辆布局图</span>
          </template>
          <el-upload class="avatar-uploader" :show-file-list="false">
            <!-- <el-icon class="avatar-uploader-icon" style="height: 100px;"><Plus /></el-icon> -->
            <el-image
              style="height: 100px"
              :src="
                globSettings.apiUrl +
                '/profile/upload/2023/01/10/WechatIMG24411_20230110133146A001.jpeg'
              "
              fit="fill"
            />
          </el-upload>
        </el-card>
      </el-timeline-item>
      <el-timeline-item
        timestamp="第三步"
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
        timestamp="第四步"
        placement="top"
        size="large"
        color="#C6E2FF"
      >
        <el-card>
          <template #header>
            <span>填写保存模版名称</span>
          </template>
          <el-input
            maxlength="10"
            placeholder="请输入模版名称"
            show-word-limit
            type="text"
          />
        </el-card>
      </el-timeline-item>
      <el-timeline-item
        timestamp="第五步"
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
import { Plus } from '@element-plus/icons-vue';
import { useGlobSettings } from '@/hooks/settings/useGlobSettings';
import { seatAllList } from '@/api/business/seat/index';
import { useConfigSeatStore } from '@/store';
import type { SeatVoOfCarConfig } from '@/api/business/seat/types';
import SeatList from './SeatList.vue';
import { ElMessage } from 'element-plus';

type SeatIconItems = {
  label: string;
  prop: 'unSelectedIcon' | 'selectedIcon' | 'boughtIcon';
  value: string;
};

const $route = useRoute();

const globSettings = useGlobSettings();
const configSeatStore = useConfigSeatStore();
const seatList = ref<SeatVoOfCarConfig[]>([]);

const formSeatIconItems = ref<SeatIconItems[]>([
  {
    label: '未选座位',
    prop: 'unSelectedIcon',
    value: '/profile/upload/2023/01/10/unSelectedSeat_20230110171254A002.png'
  },
  {
    label: '已选座位',
    prop: 'selectedIcon',
    value: '/profile/upload/2023/01/10/selectedSeat_20230110171257A003.png'
  },
  {
    label: '已购座位',
    prop: 'boughtIcon',
    value: '/profile/upload/2023/01/10/boughtSeat_20230110171259A004.png'
  }
]);

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
  ElMessage.success('保存座位成功');
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
.avatar-uploader {
  width: 100%;
  :deep(.el-upload) {
    width: 100%;
  }
  .avatar-uploader-icon {
    width: 100%;
  }
}
</style>
