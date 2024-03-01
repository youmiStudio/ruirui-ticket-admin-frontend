<template>
  <div class="app-container">
    <el-card class="mb-10px" shadow="never">
      <div class="search-form">
        <el-form ref="searchFormRef" :model="searchForm">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="订单编号" prop="orderNo">
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
              <el-form-item label="用户名称" prop="nickName">
                <el-input
                  v-model="searchForm.nickName"
                  placeholder="请输入用户名称"
                  clearable
                  maxlength="100"
                  @clear="search"
                  @change="search"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="路线名称" prop="routeName">
                <el-input
                  v-model="searchForm.routeName"
                  placeholder="请输入路线名称"
                  clearable
                  maxlength="100"
                  @clear="search"
                  @change="search"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="车辆名称" prop="carName">
                <el-input
                  v-model="searchForm.carName"
                  placeholder="请输入车辆名称"
                  clearable
                  maxlength="100"
                  @clear="search"
                  @change="search"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="车牌号码" prop="carNo">
                <el-input
                  v-model="searchForm.carNo"
                  placeholder="请输入车牌号码"
                  clearable
                  maxlength="100"
                  @clear="search"
                  @change="search"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="订单状态" prop="orderStatus">
                <dict-select
                  showNormal
                  v-model="searchForm.orderStatus"
                  type="sys_order_status"
                  placeholder="订单状态"
                  @change="search"
                ></dict-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="订单价格">
                <el-row :gutter="10">
                  <el-col :span="11">
                    <el-input
                      v-model="searchForm.minPriceAmount"
                      placeholder="最少价格"
                      clearable
                      maxlength="20"
                      @clear="search"
                    ></el-input>
                  </el-col>
                  <el-col :span="2"> - </el-col>
                  <el-col :span="11">
                    <el-input
                      v-model="searchForm.maxPriceAmount"
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
                  v-model="travelDate"
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
                  v-model="orderDate"
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
      >
        <el-table-column
          width="200"
          label="订单编号"
          prop="orderNo"
          align="center"
          :show-overflow-tooltip="true"
        >
        </el-table-column>

        <el-table-column label="总价格(元)" align="center" width="100">
          <template #default="{ row }">
            <div> {{ fenToYuan(row.totalAmount) }} </div>
          </template>
        </el-table-column>
        <el-table-column label="实收金额(元)" align="center" width="125">
          <template #default="{ row }">
            <div> {{ row.payAmount ? fenToYuan(row.payAmount) : '-' }} </div>
          </template>
        </el-table-column>
        <el-table-column width="100" label="买家名称" align="center">
          <template #default="{ row }">
            <div> {{ row.buyer.nickname }} </div>
          </template>
        </el-table-column>
        <el-table-column width="100" label="买家头像" align="center">
          <template #default="{ row }">
            <el-image class="w-50px h-50px" :src="row.buyer.avatar"></el-image>
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
        <el-table-column
          width="200"
          label="路线名称"
          prop="routeName"
          align="center"
          :show-overflow-tooltip="true"
        >
          <template #default="{ row }">
            <div>{{ row.route.name }}</div>
          </template>
        </el-table-column>

        <el-table-column
          width="200"
          label="车辆名称"
          prop="routeName"
          align="center"
          :show-overflow-tooltip="true"
        >
          <template #default="{ row }">
            <div>{{ row.car.name }}</div>
          </template>
        </el-table-column>
        <el-table-column
          width="200"
          label="车牌号码"
          prop="routeName"
          align="center"
          :show-overflow-tooltip="true"
        >
          <template #default="{ row }">
            <div>{{ row.car.no }}</div>
          </template>
        </el-table-column>
        <el-table-column label="出行时间" width="220px" align="center">
          <template #default="{ row }">
            <span>{{ row.travelDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" width="150px" align="center">
          <template #default="{ row }">
            <span>{{
              row.orderTime && parseTime(row.orderTime, '{y}-{m}-{d} {h}:{i}')
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="125px"
          fixed="right"
          label="操作"
          align="center"
        >
          <template #default="{ row }">
            <el-button
              v-if="['0', '1', '2'].some((status) => row.status === status)"
              v-authority="[pageConfig.authorites.cancel]"
              link
              type="info"
              @click="cancelOrderFn(row.orderNo)"
              >取消</el-button
            >
            <el-button
              v-if="['3'].some((status) => row.status === status)"
              v-authority="[pageConfig.authorites.refund]"
              link
              type="danger"
              @click="refundOrderFn(row.orderNo, row)"
              >退款</el-button
            >
            <el-button
              v-authority="[pageConfig.authorites.get]"
              link
              type="primary"
              @click="gotoDetail(row)"
              >查看</el-button
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
import { orderList, cancelOrder, refundOrder } from '@/api/business/order';
import { fenToYuan, yuanToFen } from '@/utils/price';
import { OrderVO } from '~/api/business/order/types';

type ModelSearchBody = any;
type ModelBody = any;
type ModelVo = any;

const router = useRouter();

/**
 * 页面配置，抽离公共部分，少搬点砖
 */
const pageConfig = reactive({
  id: 'orderId',
  isAsc: 'desc',
  orderByColumn: 'order_time',
  api: {
    list: orderList,
    refund: refundOrder,
    cancel: cancelOrder
  },
  authorites: {
    get: 'ticket:order:query',
    refund: 'ticket:order:refund',
    cancel: 'ticket:order:cancel'
  }
});

const dicts = useDictTypes(['sys_order_status']);
const tableRef = ref<InstanceType<typeof TablePanel>>();
const formRef = ref<FormInstance>();
const searchFormRef = ref<FormInstance>();
const formLoading = ref<boolean>(false);
const batchDeleteDisable = ref<boolean>(true);
const tableRecordRows = ref<ModelVo[]>([]);

const travelDate = ref();
const orderDate = ref();

const searchForm = reactive<ModelSearchBody>({
  orderNo: '',
  nickName: '',
  routeName: '',
  carName: '',
  carNo: '',
  orderStatus: '',
  minPriceAmount: '',
  maxPriceAmount: '',
  beginTravelDate: '',
  endTravelDate: '',
  beginOrderTime: '',
  endOrderTime: ''
});

onMounted(() => {
  search();
});

watch(
  () => travelDate.value,
  (arr) => {
    if (!arr) {
      searchForm.beginTravelDate = '';
      searchForm.endTravelDate = '';
      return;
    }
    searchForm.beginTravelDate = arr[0];
    searchForm.endTravelDate = arr[1];
  }
);

watch(
  () => orderDate.value,
  (arr) => {
    if (!arr) {
      searchForm.beginOrderTime = '';
      searchForm.endOrderTime = '';
      return;
    }
    searchForm.beginOrderTime = arr[0];
    searchForm.endOrderTime = arr[1];
  }
);

watch(
  tableRecordRows,
  (rows) => {
    switchBatchDelete(rows.length);
  },
  { deep: true }
);

const search = useDebounceFn(() => {
  const params: ModelSearchBody = Object.assign({}, searchForm, {
    minPriceAmount: searchForm.minPriceAmount
      ? yuanToFen(searchForm.minPriceAmount)
      : '',
    maxPriceAmount: searchForm.maxPriceAmount
      ? yuanToFen(searchForm.maxPriceAmount)
      : ''
  });
  tableRef.value && tableRef.value.search<ModelVo>(params);
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
function searchReset() {
  searchFormRef.value?.resetFields();
  searchForm.minPriceAmount = '';
  searchForm.maxPriceAmount = '';
  travelDate.value = '';
  orderDate.value = '';
}
function searchRefresh() {
  searchReset();
  search();
}

function gotoDetail(row: ModelVo) {
  router.push(`/ticket/order/detail/${row.orderNo}`);
}

function cancelOrderFn(orderNo: string) {
  ElMessageBox.confirm(`取消订单后，将无法进行“支付”，确定取消吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      pageConfig.api.cancel(orderNo).then((res) => {
        if (res.code === 200) {
          ElMessage.success('订单取消成功');
          search();
        }
      });
    })
    .catch(() => {});
}

function refundOrderFn(orderNo: string, row: OrderVO) {
  ElMessageBox.confirm(
    `提交退款后，将退款${fenToYuan(row.payAmount - row.refundAmount)}元给用户，确定退款吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(() => {
      pageConfig.api.refund(orderNo).then((res) => {
        if (res.code === 200) {
          ElMessage.success('订单提交退款成功');
          search();
        }
      });
    })
    .catch(() => {});
}
</script>

<style lang="scss" scoped>
.search-form {
  padding: 10px 20px;
  border-radius: 1px;
  background-color: #f7f8fa;
}
</style>
