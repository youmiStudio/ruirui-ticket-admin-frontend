<template>
  <div class="app-container">
    <el-card>
      <el-descriptions title="基本信息" :column="3" border>
        <el-descriptions-item
          label="用户昵称"
          label-align="right"
          align="center"
          width="150px"
          >{{ info && info.nickname }}</el-descriptions-item
        >
        <el-descriptions-item
          label="用户账号"
          label-align="right"
          align="center"
          width="150px"
          >{{ info && info.username }}</el-descriptions-item
        >
        <el-descriptions-item
          label="手机号"
          label-align="right"
          align="center"
          width="150px"
          >{{ info && info.phoneNumber }}</el-descriptions-item
        >
      </el-descriptions>
      <h4>角色信息</h4>
      <table-panel ref="tableRef" :url="fetchList" primary-key="roleId"> </table-panel>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { getUser } from '@/api/user/index';
import { UserVo } from '~/api/user/types';

const $route = useRoute();
const info = ref<UserVo>();

onMounted(() => {
  handleGetInfo();
});

// function fetchList(obj: ModelSearchBody) {
//   return pageConfig.api.list({
//     ...obj,
//     orderByColumn: pageConfig.orderByColumn,
//     isAsc: pageConfig.isAsc
//   });
// }

function handleGetInfo() {
  const { params } = $route;
  const { userId } = params;

  getUser(userId as string).then((res) => {
    const { data } = res;
    info.value = data;
  });
}
</script>

<style lang="scss" scoped></style>
