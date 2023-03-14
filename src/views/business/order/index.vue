<template>
  <div class="app-container">
    <el-card class="mb-10px" shadow="never">
      <div class="search-form">
        <el-form ref="searchFormRef" :model="searchForm">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="订单编号" prop="carName">
                <el-input
                  v-model="searchForm.orderNo"
                  placeholder="请输入订单编号"
                  clearable
                  maxlength="100"
                  @clear="search"
                  @change="search"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="用户名称" prop="carName">
                <el-input
                  v-model="searchForm.orderNo"
                  placeholder="请输入用户名称"
                  clearable
                  maxlength="100"
                  @clear="search"
                  @change="search"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="路线名称" prop="carName">
                <el-input
                  v-model="searchForm.orderNo"
                  placeholder="请输入路线名称"
                  clearable
                  maxlength="100"
                  @clear="search"
                  @change="search"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="订单状态" prop="status">
                <el-select
                  class="w100%"
                  v-model="searchForm.status"
                  placeholder="订单状态"
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
              <el-form-item label="订单价格" prop="seatName">
                <el-row :gutter="10">
                  <el-col :span="11">
                    <el-input
                      v-model="searchForm.minPrice"
                      placeholder="最少价格"
                      clearable
                      maxlength="20"
                      @clear="search"
                    ></el-input>
                  </el-col>
                  <el-col :span="2"> - </el-col>
                  <el-col :span="11">
                    <el-input
                      v-model="searchForm.maxPrice"
                      placeholder="最多价格"
                      clearable
                      maxlength="20"
                      @clear="search"
                    ></el-input>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="出行时间">
                <el-date-picker
                  class="w100%"
                  value-format="YYYY-MM-DD"
                  type="daterange"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="search"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="下单时间">
                <el-date-picker
                  class="w100%"
                  value-format="YYYY-MM-DD"
                  type="daterange"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="search"
                ></el-date-picker>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item>
                <el-button type="primary" :icon="Search" @click="search"
                  >查询</el-button
                >
                <el-button :icon="Refresh" @click="searchRefresh"
                  >重置</el-button
                >
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <TablePanel
        class="mt-10px"
        ref="tableRef"
        :url="fetchList"
        :primary-key="pageConfig.id"
        :selectType="false"
        @select-change="handleTableSelectChange"
        border="true"
      >
        <el-table-column
          width="280"
          label="订单编号"
          prop="orderNo"
          align="center"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          width="200"
          label="路线名称"
          prop="routeName"
          align="center"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column width="150" label="买家名称" align="center">
          <template #default>
            <div> L </div>
          </template>
        </el-table-column>
        <el-table-column label="总价格(元)" align="center" width="150">
          <template #default="{row}">
            <div> {{ row.price }} </div>
          </template>
        </el-table-column>
        <el-table-column label="实收金额(元)" align="center" width="150">
          <template #default="{row}">
            <div> {{ row.payPrice }} </div>
          </template>
        </el-table-column>
        <el-table-column width="150" label="订单状态" align="center">
          <template #default="{ row }">
            <DictTag
              :options="dicts.type.sys_order_status"
              :value="row.status"
            ></DictTag>
          </template>
        </el-table-column>
        <el-table-column label="出行时间" width="220px" align="center">
          <template #default="{row}">
            <span>{{ row.tripTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" width="150px" align="center">
          <template #default="{ row }">
            <span>{{
              row.createTime && parseTime(row.createTime, '{y}-{m}-{d} {h}:{i}')
            }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center">
          <template #default="{ row }">
            <el-button>查看</el-button>
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

const dicts = useDictTypes(['sys_order_status']);
const tableRef = ref<InstanceType<typeof TablePanel>>();
const formRef = ref<FormInstance>();
const searchFormRef = ref<FormInstance>();
const formLoading = ref<boolean>(false);
const batchDeleteDisable = ref<boolean>(true);
const tableRecordRows = ref<ModelVo[]>([]);

const searchForm = reactive<ModelSearchBody>({
  orderNo: '',
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
            orderId: 100,
            orderNo: 'O202303141635475492190617601',
            status: 0,
            price:'88.88',
            payPrice:'-',
            routeName: '雪山房车之旅 体验大自然 享受自由冒险',
            tripTime:'2023-03-18 10:00~11:30',
            createTime: new Date()
          },
          {
            orderId: 100,
            orderNo: 'O202303141635475492190617602',
            status: 1,
            price:'88.88',
            payPrice:'88.88',
            routeName: '雪山房车之旅 体验大自然 享受自由冒险',
            tripTime:'2023-03-18 10:00~11:30',
            createTime: new Date()
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

<style lang="scss" scoped>
.search-form {
  padding: 10px 20px;
  border-radius: 1px;
  background-color: #f7f8fa;
}
</style>
