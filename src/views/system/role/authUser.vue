<template>
  <div class="app-container">
    <el-card class="mb-10px" shadow="never">
      <el-form ref="searchFormRef" :model="searchForm">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="用户名称" prop="username">
              <el-input
                v-model="searchForm.username"
                placeholder="请输入用户名称"
                clearable
                maxlength="20"
                @clear="search"
                @change="search"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="手机号码" prop="phoneNumber">
              <el-input
                v-model="searchForm.phoneNumber"
                placeholder="请输入手机号码"
                clearable
                maxlength="11"
                @clear="search"
                @change="search"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" :icon="Search" @click="search"
                >查询</el-button
              >
              <el-button :icon="Refresh" @click="searchRefresh">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            v-authority="[pageConfig.authorites.edit]"
            type="primary"
            plain
            size="small"
            :icon="Plus"
            @click="handleAdd"
            >新增用户</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            v-authority="[pageConfig.authorites.edit]"
            type="danger"
            plain
            size="small"
            :icon="Delete"
            :disabled="batchDeleteDisable"
            @click="handleBatchDelete"
            >批量取消授权</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            size="small"
            :icon="Close"
            @click="handleClose"
            >返回</el-button
          >
        </el-col>
      </el-row>

      <TablePanel
        ref="tableRef"
        :url="fetchList"
        :primary-key="pageConfig.id"
        @select-change="handleTableSelectChange"
      >
        <el-table-column label="用户名称" prop="username" align="center">
        </el-table-column>
        <el-table-column label="用户昵称" prop="nickname" align="center">
        </el-table-column>
        <el-table-column label="手机" prop="phoneNumber" align="center">
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template #default="{ row }">
            <DictTag
              :options="dicts.type.sys_common_status"
              :value="row.status"
            ></DictTag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="150px" align="center">
          <template #default="{ row }">
            <span>{{
              row.createTime && parseTime(row.createTime, '{y}-{m}-{d} {h}:{i}')
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="{ row }">
            <el-button
              text
              v-authority="[pageConfig.authorites.edit]"
              size="small"
              type="primary"
              :icon="CircleClose"
              @click.stop="handleCancelAuthUser(row)"
              >取消授权</el-button
            >
          </template>
        </el-table-column>
      </TablePanel>
    </el-card>

    <select-user ref="selectUserRef" @ok="search"></select-user>
  </div>
</template>

<script lang="ts" setup>
import {
  Search,
  Refresh,
  Plus,
  CircleClose,
  Delete,
Close
} from '@element-plus/icons-vue';
import { useDebounceFn } from '@vueuse/shared';
import TablePanel from '@/components/TablePanel/index.vue';
import useDictTypes from '@/hooks/web/useDictTypes';
import { parseTime } from '@/utils';
import { vAuthority } from '@/directive/authority';
import { ElMessageBox, ElMessage } from 'element-plus';

import SelectUser from './selectUser.vue';

import {
  allocatedList,
  cancelAuthUser,
  cancelAuthUserAll
} from '@/api/role/index';
import type { RoleUserSearchBody } from '@/api/role/types';
import type { FormInstance } from 'element-plus';
import { UserVo } from '~/api/user/types';

const $route = useRoute();
const $router = useRouter();
const dicts = useDictTypes('sys_common_status');

/**
 * 页面配置，抽离公共部分，少搬点砖
 */
const pageConfig = reactive({
  id: 'userId',
  isAsc: 'desc',
  orderByColumn: 'user_id',
  api: {
    list: allocatedList
  },
  authorites: {
    list: 'system:role:list',
    edit: 'system:role:edit'
  }
});

const selectUserRef = ref<InstanceType<typeof SelectUser>>();
const tableRef = ref<InstanceType<typeof TablePanel>>();
const searchFormRef = ref<FormInstance>();
const tableRecordRows = ref<UserVo[]>([]);
const batchDeleteDisable = ref<boolean>(true);

const searchForm = reactive<RoleUserSearchBody>({
  username: '',
  phoneNumber: '',
  roleId: $route.params.roleId
});

watch(
  tableRecordRows,
  (rows) => {
    switchBatchDelete(rows.length);
  },
  { deep: true }
);

onMounted(() => {
  search();
});

const search = useDebounceFn(() => {
  tableRef.value && tableRef.value.search({ ...searchForm });
}, 200);

function fetchList(obj: RoleUserSearchBody) {
  return pageConfig.api.list({
    ...obj,
    orderByColumn: pageConfig.orderByColumn,
    isAsc: pageConfig.isAsc
  });
}
function searchReset() {
  searchFormRef.value?.resetFields();
}

function searchRefresh() {
  searchReset();
  search();
}

function handleCancelAuthUser(row: any) {
  ElMessageBox.confirm(`确定要取消该用户“${row.username}”角色吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      cancelAuthUser({
        userId: row.userId,
        roleId: $route.params.roleId as string
      }).then((res) => {
        ElMessage.success('取消授权角色成功');
        search();
      });
    })
    .catch(() => {});
}

function handleTableSelectChange(recordRows: any[]) {
  tableRecordRows.value = recordRows;
}

function switchBatchDelete(selectRowsLength: number) {
  if (selectRowsLength > 0) {
    batchDeleteDisable.value = false;
    return;
  }
  batchDeleteDisable.value = true;
}

function handleBatchDelete() {
  const ids = tableRecordRows.value.map((row) => row[pageConfig.id]);

  ElMessageBox.confirm(`确定要取消该用户“${ids.join(',')}”角色吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      cancelAuthUserAll({
        userIds: ids.join(','),
        roleId: $route.params.roleId as string
      }).then((res) => {
        ElMessage.success('取消授权角色成功');
        search();
      });
    })
    .catch(() => {});
}

function handleAdd() {
  selectUserRef.value && selectUserRef.value.show();
}

function handleClose() {
  $router.push("/system/role")
}
</script>

<style lang="scss" scoped></style>
