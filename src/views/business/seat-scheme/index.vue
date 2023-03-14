<template>
  <div class="app-container">
    <el-card class="mb-10px" shadow="never">
      <el-form ref="searchFormRef" :model="searchForm">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="座位方案名称" prop="carName">
              <el-input
                v-model="searchForm.carName"
                placeholder="请输入座位方案"
                clearable
                maxlength="100"
                @clear="search"
                @change="search"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="状态" prop="status">
              <el-select
                class="w100%"
                v-model="searchForm.status"
                placeholder="座位方案状态"
                @change="search"
              >
                <el-option label="全部" value=""></el-option>
                <el-option
                  v-for="dict in dicts.type.sys_common_status"
                  :label="dict.label"
                  :value="dict.value"
                  :key="dict.value"
                ></el-option>
              </el-select>
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
            v-authority="[pageConfig.authorites.add]"
            type="primary"
            plain
            size="small"
            :icon="Plus"
            >新增</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            v-authority="[pageConfig.authorites.remove]"
            type="danger"
            plain
            size="small"
            :icon="Delete"
            :disabled="batchDeleteDisable"
            >删除</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            v-authority="[pageConfig.authorites.export]"
            type="warning"
            plain
            size="small"
            :icon="Download"
            >导出</el-button
          >
        </el-col>
      </el-row>

      <TablePanel
        ref="tableRef"
        :url="fetchList"
        :primary-key="pageConfig.id"
        @select-change="handleTableSelectChange"
      >
        <el-table-column
          label="座位方案编号"
          prop="seatSchemeId"
          sortable="custom"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="座位方案名称"
          prop="seatSchemeName"
          align="center"
        >
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
        <el-table-column
          label="操作"
          align="center"
          class-name="fixed-width"
          width="200px"
        >
          <template #default="{ row }">
            <el-button size="small" link type="primary" :icon="Edit"
              >修改</el-button
            >
            <el-button
              link
              size="small"
              type="danger"
              :key="row[pageConfig.id]"
              :icon="Delete"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </TablePanel>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import {
  Search,
  Refresh,
  Plus,
  Edit,
  Delete,
  Download,
  RefreshRight,
  Setting
} from '@element-plus/icons-vue';
import TablePanel from '@/components/TablePanel/index.vue';
import useDictTypes from '@/hooks/web/useDictTypes';
import { parseTime } from '@/utils';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useDebounceFn } from '@vueuse/shared';
import { vAuthority } from '@/directive/authority';

type ModelSearchBody = any;
type ModelBody = any;
type ModelVo = any;

/**
 * 页面配置，抽离公共部分，少搬点砖
 */
const pageConfig = reactive({
  title: '车辆',
  id: 'carId',
  isAsc: 'asc',
  orderByColumn: 'car_id',
  api: {
    list: null,
    get: null,
    add: null,
    remove: null,
    edit: null,
    export: null
  },
  authorites: {
    list: 'ticket:car:list',
    get: 'ticket:car:query',
    add: 'ticket:car:add',
    edit: 'ticket:car:edit',
    remove: 'ticket:car:remove',
    export: 'ticket:car:export'
  }
});

const dicts = useDictTypes(['sys_common_status']);
const tableRef = ref<InstanceType<typeof TablePanel>>();
const formRef = ref<FormInstance>();
const searchFormRef = ref<FormInstance>();
const formLoading = ref<boolean>(false);
const batchDeleteDisable = ref<boolean>(true);
const tableRecordRows = ref<ModelVo[]>([]);

const searchForm = reactive<ModelSearchBody>({
  carName: '',
  carNo: '',
  status: ''
});

onMounted(() => {
  search();
});

watch(
  tableRecordRows,
  (rows) => {
    switchBatchDelete(rows.length);
  },
  { deep: true }
);

const search = useDebounceFn(() => {
  tableRef.value && tableRef.value.search<ModelVo>({ ...searchForm });
}, 200);

function switchBatchDelete(selectRowsLength: number) {
  if (selectRowsLength > 0) {
    batchDeleteDisable.value = false;
    return;
  }
  batchDeleteDisable.value = true;
}

function handleTableSelectChange(recordRows: any[]) {
  tableRecordRows.value = recordRows;
}

function fetchList(obj: ModelSearchBody) {
  // return pageConfig.api.list({
  //   ...obj,
  //   orderByColumn: pageConfig.orderByColumn,
  //   isAsc: pageConfig.isAsc
  // });
  return new Promise((resolve, reject) => {
    resolve({
      code: 200,
      data: {
        total: 1,
        items: [
          {
            seatSchemeId: 100,
            seatSchemeName: '飞翔铁CPLUS座位',
            status: 0,
            createTime:new Date()
          }
        ]
      }
    });
  });
}
function searchReset() {
  searchFormRef.value?.resetFields();
}
function searchRefresh() {
  searchReset();
  search();
}
</script>

<style lang="scss" scoped></style>
