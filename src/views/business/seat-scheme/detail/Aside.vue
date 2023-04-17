<template>
  <aside class="aside w330px shrink-0 pt-20px pl-20px pr-20px overflow-auto">
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
            <template v-for="item in seatIconList" :key="item.prop">
              <el-col
                class="flex flex-col justify-center items-center"
                :span="8"
              >
                <upload-image
                  class="seat-upload"
                  v-model="item.value"
                  :label="item.label"
                  @success="seatSchemeStore.uploadOnSuccess"
                ></upload-image>
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
          <upload-image
            class="plane-upload"
            v-model="carPlaneImage"
            :show-label="false"
            @success="seatSchemeStore.uploadOnSuccess"
          ></upload-image>
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
          <seat-list :data="seatTypeList" :icon="defaultIcon"></seat-list>
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
            v-model="seatSchemeName"
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
import { useSeatSchemeStore } from '@/store';
import SeatList from '../components/SeatList.vue';
import { ElMessage } from 'element-plus';

import { storeToRefs } from 'pinia';

const seatSchemeStore = useSeatSchemeStore();
const router = useRouter();
const route = useRoute();

const {
  seatIconList,
  carPlaneImage,
  seatTypeList,
  defaultIcon,
  seatSchemeName
} = storeToRefs(seatSchemeStore);

onMounted(() => {
  seatSchemeStore.getSeatTypeList();
});

onUnmounted(seatSchemeStore.destory);
addEventListener('beforeunload', seatSchemeStore.destory);

function handleSave() {
  seatSchemeStore.save().then((id) => {
    router.replace(`/ticket/seat-scheme/edit/${id}`);
    setTimeout(() => {
      window.location.reload()
    }, 300);
  });
}

function handleReset() {
  seatSchemeStore.reset()
}
</script>

<style lang="scss" scoped>
:deep() {
  .seat-upload {
    .avatar-uploader,
    .avatar-uploader-icon {
      width: 65px !important;
      height: 65px !important;
    }
  }
  .plane-upload {
    .avatar-uploader,
    .avatar-uploader-icon {
      height: 150px !important;
    }
    .avatar {
      width: 100%;
      height: 100%;
    }
  }
  .el-card__header,
  .el-timeline-item__timestamp {
    text-align: center;
  }
  .el-timeline-item__timestamp {
    margin-bottom: 8px;
  }
}
</style>
