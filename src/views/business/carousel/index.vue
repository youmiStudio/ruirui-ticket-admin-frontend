<template>
  <div class="app-container">
    <el-card class="mb-10px" shadow="never">
      <el-form ref="searchFormRef" :model="searchForm">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="状态" prop="status">
              <el-select
                class="w100%"
                v-model="searchForm.status"
                placeholder="轮播状态"
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
            <el-form-item label-width="0">
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
            @click="handleAdd"
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
            @click="handleBatchDelete"
            >删除</el-button
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
          width="105px"
          label="轮播编号"
          prop="carouselId"
          sortable="custom"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="路线名称"
          prop="routeName"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column label="图片" align="center">
          <template #default="{ row }">
            <div>
              <el-image style="width: 100%;" :src="row.original"></el-image>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          width="100px"
          label="排序"
          prop="sort"
          align="center"
        ></el-table-column>
        <el-table-column width="100px" label="状态" align="center">
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
          width="175px"
          label="操作"
          align="center"
          class-name="fixed-width"
        >
          <template #default="{ row }">
            <el-button
              v-authority="[pageConfig.authorites.edit]"
              size="small"
              link
              type="primary"
              :icon="Edit"
              @click.stop="handleEdit(row)"
              >修改</el-button
            >
            <el-button
              v-authority="[pageConfig.authorites.remove]"
              link
              size="small"
              type="danger"
              :key="row[pageConfig.id]"
              :icon="Delete"
              @click.stop="handleRowDelete(row)"
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
  Download
} from '@element-plus/icons-vue';
import TablePanel from '@/components/TablePanel/index.vue';
import useDictTypes from '@/hooks/web/useDictTypes';
import * as CAROUSEL_API from '@/api/business/carousel';
import { uploadFile } from '@/api/common/index';
import { isAmount, isImage } from '@/utils/is';
import { yuanToFen, fenToYuan } from '@/utils/price';
import { parseTime } from '@/utils';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useDebounceFn } from '@vueuse/shared';
import { vAuthority } from '@/directive/authority';

import type { FormInstance, FormRules } from 'element-plus';
import type {
  CarouselDTO,
  CarouselVO,
  CarouselPageSearchDTO
} from '~/api/business/carousel/types';

import carouselBox from './carouselBox';

type ModelSearchBody = CarouselPageSearchDTO;
type ModelVo = CarouselVO;

/**
 * 页面配置，抽离公共部分，少搬点砖
 */
const pageConfig = reactive({
  title: '轮播',
  id: 'carouselId',
  isAsc: 'desc',
  orderByColumn: 'carousel_id',
  api: {
    list: CAROUSEL_API.list,
    get: CAROUSEL_API.detail,
    add: CAROUSEL_API.save,
    remove: CAROUSEL_API.remove,
    edit: CAROUSEL_API.edit
  },
  authorites: {
    list: 'ticket:carousel:list',
    get: 'ticket:carousel:query',
    add: 'ticket:carousel:add',
    edit: 'ticket:carousel:edit',
    remove: 'ticket:carousel:remove'
  }
});

const dicts = useDictTypes('sys_common_status');
const tableRef = ref<InstanceType<typeof TablePanel>>();
const searchFormRef = ref<FormInstance>();
const batchDeleteDisable = ref<boolean>(true);
const tableRecordRows = ref<ModelVo[]>([]);

const searchForm = reactive<ModelSearchBody>({
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
  tableRef.value &&
    tableRef.value.search<ModelVo>({
      ...searchForm
    });
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
  return pageConfig.api.list({
    ...obj,
    orderByColumn: pageConfig.orderByColumn,
    isAsc: pageConfig.isAsc
  });
}

function getDetail(id: number): Promise<ModelVo> {
  return new Promise((resolve, reject) => {
    pageConfig.api.get(id).then((res) => {
      const { data } = res;
      if (data) {
        resolve(data);
      }
    });
  });
}

function handleRowDelete(row: any) {
  batchDelete(row[pageConfig.id]).then(() => {
    search();
    ElMessage.success('删除成功');
  });
}

function handleBatchDelete() {
  const ids = tableRecordRows.value.map((row) => row[pageConfig.id]);
  batchDelete(ids.join(',')).then(() => {
    search();
    ElMessage.success('删除成功');
  });
}

function batchDelete(ids: string) {
  return new Promise((resolve, reject) => {
    ElMessageBox.confirm(
      `确定要删除${pageConfig.title}编号[${ids}]的数据项吗？`,
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
      .then(() => {
        pageConfig.api.remove(ids).then((res) => {
          const { code } = res;
          if (code === 200) {
            resolve(res);
          } else {
            reject(res);
          }
        });
      })
      .catch(() => {});
  });
}

function clearTableRecordRows() {
  if (!tableRef.value) return;
  tableRef.value.clearRecord();
}

function searchReset() {
  searchFormRef.value?.resetFields();
  Object.keys(searchForm).forEach((key) => {
    searchForm[key] = '';
  });
}

function searchRefresh() {
  searchReset();
  search();
}

function handleAdd() {
  carouselBox
    .show()
    .then(() => {
      search();
    })
    .catch(() => {});
}

function handleEdit(row: ModelVo) {
  carouselBox
    .show({
      id: row.carouselId
    })
    .then(() => {
      search();
    })
    .catch(() => {});
}
</script>

<style lang="scss" scoped></style>
