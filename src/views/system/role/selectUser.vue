<template>
  <el-dialog
    v-model="visible"
    title="选择用户"
    width="800px"
    top="10vh"
    append-to-body
  >
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
    </TablePanel>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button
          v-authority="[pageConfig.authorites.edit]"
          type="primary"
          @click="handleConfirm"
        >
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import {
  Search,
  Refresh,
  Plus,
  CircleClose,
  Delete
} from '@element-plus/icons-vue';
import { useDebounceFn } from '@vueuse/shared';
import TablePanel from '@/components/TablePanel/index.vue';
import useDictTypes from '@/hooks/web/useDictTypes';
import { parseTime } from '@/utils';
import { vAuthority } from '@/directive/authority';
import { ElMessageBox, ElMessage, dialogEmits } from 'element-plus';

import { unallocatedList, authUserSelectAll } from '@/api/role/index';
import type { RoleUserSearchBody } from '@/api/role/types';
import type { FormInstance } from 'element-plus';
import { UserVo } from '~/api/user/types';
import { emit } from 'process';

defineExpose({
  show
});

const $emit = defineEmits(['ok']);
/**
 * 页面配置，抽离公共部分，少搬点砖
 */
const pageConfig = reactive({
  id: 'userId',
  isAsc: 'desc',
  orderByColumn: 'user_id',
  api: {
    list: unallocatedList
  },
  authorites: {
    edit: 'system:role:edit'
  }
});

const visible = ref<boolean>(false);
const tableRef = ref<InstanceType<typeof TablePanel>>();
const searchFormRef = ref<FormInstance>();
const tableRecordRows = ref<UserVo[]>([]);
const batchDeleteDisable = ref<boolean>(true);

const $route = useRoute();
const dicts = useDictTypes('sys_common_status');

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

function handleTableSelectChange(recordRows: any[]) {
  tableRecordRows.value = recordRows;
}

function searchRefresh() {
  searchReset();
  search();
}

function switchBatchDelete(selectRowsLength: number) {
  if (selectRowsLength > 0) {
    batchDeleteDisable.value = false;
    return;
  }
  batchDeleteDisable.value = true;
}

function show() {
  visible.value = true;
  search();
}

function handleConfirm() {
  const ids = tableRecordRows.value.map((row) => row[pageConfig.id]);
  const roleId = $route.params.roleId;

  authUserSelectAll({
    roleId: roleId as string,
    userIds: ids.join(',')
  }).then((res) => {
    visible.value = false;
    ElMessage.success('添加成功');
    $emit('ok');
  });
}
</script>

<style lang="scss" scoped></style>
