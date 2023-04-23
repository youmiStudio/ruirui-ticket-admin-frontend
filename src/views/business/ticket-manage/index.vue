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
              <el-form-item label="乘车人姓名" prop="passengerName">
                <el-input
                  v-model="searchForm.passengerName"
                  placeholder="请输入乘车人姓名"
                  clearable
                  maxlength="100"
                  @clear="search"
                  @change="search"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="手机号码" prop="passengerPhone">
                <el-input
                  v-model="searchForm.passengerPhone"
                  placeholder="请输入乘车人手机号码"
                  clearable
                  maxlength="100"
                  @clear="search"
                  @change="search"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="证件号" prop="passengerIdNumber">
                <el-input
                  v-model="searchForm.passengerIdNumber"
                  placeholder="请输入乘车人证件号"
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
              <el-form-item label="实收金额" prop="minPayAmount">
                <el-row :gutter="10">
                  <el-col :span="11">
                    <el-input
                      v-model="searchForm.minPayAmount"
                      placeholder="最少价格"
                      clearable
                      maxlength="20"
                      @clear="search"
                    ></el-input>
                  </el-col>
                  <el-col :span="2"> - </el-col>
                  <el-col :span="11">
                    <el-input
                      v-model="searchForm.maxPayAmount"
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
        :formatter="formatter"
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
        <el-table-column width="150" label="乘车状态" align="center">
          <template #default="{ row }">
            <DictTag type="sys_order_item_status" :value="row.status"></DictTag>
          </template>
        </el-table-column>
        <el-table-column label="座位金额(元)" align="center" width="150">
          <template #default="{ row }">
            <div> {{ fenToYuan(row.seatPrice) }} </div>
          </template>
        </el-table-column>
        <el-table-column width="100" label="乘车人名称" align="center">
          <template #default="{ row }">
            <div> {{ row.passengerName }} </div>
          </template>
        </el-table-column>
        <el-table-column width="100" label="证件类型" align="center">
          <template #default="{ row }">
            <dict-tag
              type="sys_passenger_idType"
              :value="row.passengerIdType"
            ></dict-tag>
          </template>
        </el-table-column>
        <el-table-column width="200" label="证件号码" align="center">
          <template #default="{ row }">
            <span>{{
              row.idCardVisible ? row.unSafeIdCard : row.passengerIdNumber
            }}</span>
            <span
              v-authority="[pageConfig.authorites.sensitive]"
              class="ml-3px link"
              @click="triggerViewIdCard(row)"
              >{{ row.idCardVisible ? '隐藏' : '查看' }}</span
            >
          </template>
        </el-table-column>
        <el-table-column width="200" label="手机号码" align="center">
          <template #default="{ row }">
            <span>{{
              row.phoneVisible ? row.unSafePhone : row.passengerPhone
            }}</span>
            <span
              v-authority="[pageConfig.authorites.sensitive]"
              class="ml-3px link"
              @click="triggerViewPhone(row)"
              >{{ row.phoneVisible ? '隐藏' : '查看' }}</span
            >
          </template>
        </el-table-column>
        <el-table-column width="100" label="买家头像" align="center">
          <template #default="{ row }">
            <el-image class="w-50px h-50px" :src="row.buyer.avatar"></el-image>
          </template>
        </el-table-column>
        <el-table-column width="100" label="买家昵称" align="center">
          <template #default="{ row }">
            <div>{{ row.buyer.nickname }}</div>
          </template>
        </el-table-column>
        <el-table-column
          width="150"
          label="路线名称"
          align="center"
          :show-overflow-tooltip="true"
        >
          <template #default="{ row }">
            <div> {{ row.route.name }} </div>
          </template>
        </el-table-column>
        <el-table-column
          width="150"
          label="车辆名称"
          align="center"
          :show-overflow-tooltip="true"
        >
          <template #default="{ row }">
            <div> {{ row.car.name }} </div>
          </template>
        </el-table-column>
        <el-table-column
          width="100"
          label="车牌号码"
          align="center"
          :show-overflow-tooltip="true"
        >
          <template #default="{ row }">
            <div> {{ row.car.no }} </div>
          </template>
        </el-table-column>
        <el-table-column label="选座情况" align="center" width="150">
          <template #default="{ row }">
            <span class="link">点击查看</span>
          </template>
        </el-table-column>
        <el-table-column label="出行时间" width="220px" align="center">
          <template #default="{ row }">
            <span>{{
              row.travelDate && parseTime(row.travelDate, '{y}-{m}-{d}')
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" width="150px" align="center">
          <template #default="{ row }">
            <span>{{
              row.orderTime && parseTime(row.orderTime, '{y}-{m}-{d} {h}:{i}')
            }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center" width="120">
          <template #default="{ row }">
            <div v-if="row.status === '1'">
              <el-button
                v-authority="[pageConfig.authorites.itemReceipt]"
                size="small"
                link
                type="primary"
                @click.stop="receiptOrderItemFn(row)"
                >核销</el-button
              >
              <el-button
                v-authority="[pageConfig.authorites.itemRefund]"
                size="small"
                link
                type="danger"
                @click.stop="refundOrderItemFn(row)"
                >退款</el-button
              >
            </div>
            <div v-else>-</div>
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
import {
  orderItemPageList,
  receiptOrderItem,
  refundOrderItem
} from '@/api/business/order/index';
import {
  getPassengerIdCard,
  getPassengerPhone
} from '@/api/business/passenger';
import type { OrderItemPageSearchDTO } from '@/api/business/order/types';
import type { R } from '@/api/types';
import { vAuthority } from '@/directive/authority';
import { fenToYuan, yuanToFen } from '@/utils/price';

import AES from '@/utils/aes';
type ModelSearchBody = OrderItemPageSearchDTO;
type ModelBody = any;
type ModelVo = any;

/**
 * 页面配置，抽离公共部分，少搬点砖
 */
const pageConfig = reactive({
  id: 'orderItemId',
  isAsc: 'desc',
  orderByColumn: 'order_time',
  api: {
    getPassengerIdCard,
    getPassengerPhone,
    receiptOrderItem,
    refundOrderItem,
    list: orderItemPageList,
    edit: null,
    export: null
  },
  authorites: {
    list: 'ticket:order-item:list',
    itemReceipt: 'ticket:orderItem:delivery',
    itemRefund: 'ticket:orderItem:refund',
    sensitive: 'ticket:passenger:view:sensitive'
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
  passengerName: '',
  passengerPhone: '',
  passengerIdNumber: '',
  routeName: '',
  carName: '',
  carNo: '',
  minPayAmount: '',
  maxPayAmount: '',
  beginTravelDate: '',
  endTravelDate: '',
  beginOrderTime: '',
  endOrderTime: ''
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
  const params: ModelSearchBody = Object.assign({}, searchForm, {
    minPayAmount: searchForm.minPayAmount
      ? yuanToFen(searchForm.minPayAmount)
      : '',
    maxPayAmount: searchForm.maxPayAmount
      ? yuanToFen(searchForm.maxPayAmount)
      : ''
  });
  tableRef.value && tableRef.value.search<ModelVo>(params);
}, 200);

const formatter = (res: any) => {
  const { data } = res;
  if (!data.items) return [];
  const list = [...data.items];

  return list;
};

const processViewEncryptField = (opt: {
  visibleKey: string;
  key: string;
  api: (passengerId: number) => Promise<R<string>>;
  row: any;
}) => {
  const { visibleKey, key, api, row } = opt;
  row[visibleKey] = !row[visibleKey];
  if (!row[key]) {
    api(row.passengerId).then((res) => {
      if (res.code === 200 && res.data) {
        row[key] = AES.decrypt(res.data);
      }
    });
  }
};

const triggerViewIdCard = (row: any) => {
  const visibleKey = 'idCardVisible';
  const key = 'unSafeIdCard';
  const api = pageConfig.api.getPassengerIdCard;

  processViewEncryptField({
    visibleKey,
    key,
    api,
    row
  });
};

const triggerViewPhone = (row: any) => {
  const visibleKey = 'phoneVisible';
  const key = 'unSafePhone';
  const api = pageConfig.api.getPassengerPhone;

  processViewEncryptField({
    visibleKey,
    key,
    api,
    row
  });
};

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

function fetchList(obj: any) {
  return pageConfig.api.list({
    ...obj,
    orderByColumn: pageConfig.orderByColumn,
    isAsc: pageConfig.isAsc
  });
}
function searchReset() {
  searchFormRef.value?.resetFields();
  searchForm.minPayAmount = '';
  searchForm.maxPayAmount = '';
  travelDate.value = '';
  orderDate.value = '';
}
function searchRefresh() {
  searchReset();
  search();
}

function receiptOrderItemFn(row: any) {
  ElMessageBox.confirm(
    `确认出行后，此订单项将无法发起“退款”，确认出行吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(() => {
      pageConfig.api
        .receiptOrderItem({
          orderNo: row.orderNo,
          orderItemId: row.orderItemId
        })
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success('确认出行成功');
            search();
          }
        });
    })
    .catch(() => {});
}

function refundOrderItemFn(row: any) {
  ElMessageBox.confirm(
    `提交退款后，将退款${fenToYuan(row.seatPrice)}元给用户，确定退款吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(() => {
      pageConfig.api
        .refundOrderItem({
          orderNo: row.orderNo,
          orderItemId: row.orderItemId
        })
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success('提交退款成功');
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
