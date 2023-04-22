<template>
  <div class="app-container">
    <el-button :icon="ArrowLeft" size="small" @click="goBack">返回</el-button>
    <el-button
      v-authority="[pageConfig.authorites.cancel]"
      v-if="['0', '1', '2'].some((status) => orderInfo.status === status)"
      type="info"
      size="small"
      @click="cancelOrderFn"
      >取消订单</el-button
    >
    <el-button
      v-authority="[pageConfig.authorites.refund]"
      v-if="['3'].some((status) => orderInfo.status === status)"
      type="danger"
      size="small"
      @click="refundOrderFn"
      >退款订单</el-button
    >
    <el-card class="mt-10px mb-10px" shadow="never">
      <el-form
        ref="searchFormRef"
        :model="orderInfo"
        label-suffix=":"
        label-position="left"
        :label-width="80"
      >
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="订单编号">
              {{ orderInfo.orderNo }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="订单状态">
              <dict-tag type="sys_order_status" :value="orderInfo.status" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="订单来源"> 微信小程序 </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="买家名称">
              {{ orderInfo.buyer.nickname }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="买家头像">
              <el-image
                class="w-50px h-50px"
                :src="orderInfo.buyer.avatar"
              ></el-image>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出行人数"> {{ orderItemCount }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="支付时间">
              {{ orderInfo.paymentTime ? orderInfo.paymentTime : '-' }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="退款时间">
              {{ orderInfo.refundTime ? orderInfo.refundTime : '-' }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="下单时间">
              {{ orderInfo.orderTime ? orderInfo.orderTime : '-' }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="支付方式">
              {{ orderInfo.payAmount ? '微信支付' : '-' }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发票信息">
              {{ orderInfo.paymentTime ? '暂无发票信息' : '-' }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card class="mb-10px" shadow="never">
      <div class="info-wrap">
        <div class="title-wrap">路线信息</div>
        <div class="content-wrap">
          <table class="info-table">
            <colgroup>
              <col style="width: 8%" />
              <col style="width: 15%" />
              <col style="width: 15%" />
              <col style="width: 15%" />
            </colgroup>
            <thead>
              <tr>
                <th>路线主图</th>
                <th>路线名称</th>
                <th>路线描述</th>
                <th>出行时间</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <el-image :src="orderInfo.route.mainImgUrl"></el-image>
                </td>
                <td>
                  <span>{{ orderInfo.route.name }}</span>
                </td>
                <td>
                  <span>{{
                    orderInfo.route.describe ? orderInfo.route.describe : '-'
                  }}</span>
                </td>
                <td>
                  <span
                    >{{ orderInfo.travelDate }}
                    {{ orderInfo.routeSku.name }}</span
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="info-wrap">
        <div class="title-wrap">车辆信息</div>
        <div class="content-wrap">
          <table class="info-table">
            <colgroup>
              <col style="width: 8%" />
              <col style="width: 15%" />
              <col style="width: 15%" />
              <col style="width: 15%" />
            </colgroup>
            <thead>
              <tr>
                <th>车辆主图</th>
                <th>车辆名称</th>
                <th>车辆描述</th>
                <th>车牌号码</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <el-image :src="orderInfo.car.mainImgUrl"></el-image>
                </td>
                <td>
                  <span>{{ orderInfo.car.name }}</span>
                </td>
                <td>
                  <span>{{
                    orderInfo.car.describe ? orderInfo.car.describe : '-'
                  }}</span>
                </td>
                <td>
                  <span>{{ orderInfo.car.no }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="info-wrap">
        <div class="title-wrap">乘车人信息</div>
        <div class="content-wrap">
          <table class="info-table">
            <colgroup>
              <col style="width: 8%" />
              <col style="width: 8%" />
              <col style="width: 18%" />
              <col style="width: 15%" />
              <col style="width: 10%" />
              <col style="width: 10%" />
              <col style="width: 10%" />
              <col style="width: 10%" />
              <col style="width: 25%" />
            </colgroup>
            <thead>
              <tr>
                <th>姓名</th>
                <th>证件类型</th>
                <th>证件号码</th>
                <th>手机号码</th>
                <th>座位名称</th>
                <th>座位描述</th>
                <th>座位单价(元)</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in orderItems" :key="item.orderItemId">
                <td> {{ item.passengerName }} </td>
                <td>
                  <dict-tag
                    type="sys_passenger_idType"
                    :value="item.passengerIdType"
                  ></dict-tag>
                </td>
                <td>
                  <span>{{
                    item.idCardVisible
                      ? item.unSafeIdCard
                      : item.passengerIdNumber
                  }}</span>
                  <span class="ml-3px link" @click="triggerViewIdCard(item)">{{
                    item.idCardVisible ? '隐藏' : '查看'
                  }}</span>
                </td>
                <td>
                  <span>{{
                    item.phoneVisible ? item.unSafePhone : item.passengerPhone
                  }}</span>
                  <span class="ml-3px link" @click="triggerViewPhone(item)">{{
                    item.phoneVisible ? '隐藏' : '查看'
                  }}</span>
                </td>
                <td>
                  <span>{{ item.seatName }}</span>
                </td>
                <td>
                  <span>{{ item.seatDescribe }}</span>
                </td>
                <td>
                  <span>{{ fenToYuan(item.seatPrice) }}</span>
                </td>
                <td>
                  <dict-tag
                    type="sys_order_item_status"
                    :value="item.status"
                  ></dict-tag>
                </td>
                <td>
                  <div v-if="item.status === '1'">
                    <el-button
                      v-authority="[pageConfig.authorites.itemReceipt]"
                      link
                      type="primary"
                      size="small"
                      @click="receiptOrderItemFn(item)"
                      >出行</el-button
                    >
                    <el-button
                      v-authority="[pageConfig.authorites.itemRefund]"
                      link
                      type="danger"
                      size="small"
                      @click="refundOrderItemFn(item)"
                      >退款</el-button
                    >
                  </div>
                  <div v-else>-</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="price-wrap">
        <span class="mr-3px">总金额:</span>
        <span class="price">{{ fenToYuan(orderInfo.totalAmount) }}</span>
        <span class="ml-3px">元</span>
      </div>

      <div class="price-wrap" v-if="orderInfo.payAmount">
        <span class="mr-3px">支付金额:</span>
        <span class="price">{{ fenToYuan(orderInfo.payAmount) }}</span>
        <span class="ml-3px">元</span>
      </div>

      <div class="price-wrap" v-if="orderInfo.refundAmount">
        <span class="mr-3px">退款金额:</span>
        <span class="price">{{ fenToYuan(orderInfo.refundAmount) }}</span>
        <span class="ml-3px">元</span>
      </div>

      <div class="price-wrap finish-price" v-if="orderInfo.payAmount">
        <span class="mr-3px">实收金额:</span>
        <span class="price">{{
          fenToYuan(
            (orderInfo.payAmount ? orderInfo.payAmount : 0) -
              (orderInfo.refundAmount ? orderInfo.payAmount : 0)
          )
        }}</span>
        <span class="ml-3px">元</span>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ElMessageBox, ElMessage } from 'element-plus';
import { openLoading, closeLoading } from '@/hooks/web/useLoading';
import { ArrowLeft } from '@element-plus/icons-vue';
import { cancelOrder, refundOrder } from '@/api/business/order';
import {
  getOrder,
  orderItemList,
  receiptOrderItem,
  refundOrderItem
} from '@/api/business/order/index';
import { OrderVO, OrderItemVo } from '~/api/business/order/types';
import {
  getPassengerIdCard,
  getPassengerPhone
} from '@/api/business/passenger';
import type { R } from '@/api/types';
import { vAuthority } from '@/directive/authority';

import AES from '@/utils/aes';

import { fenToYuan } from '@/utils/price';
import { useGlobSettings } from '@/hooks/settings/useGlobSettings';

type OrderItemVO = {
  idCardVisible?: boolean;
  phoneVisible?: boolean;
  unSafeIdCard?: string;
  unSafePhone?: string;
} & OrderItemVo;

const route = useRoute();
const router = useRouter();
let ws: WebSocket;

/**
 * 页面配置，抽离公共部分，少搬点砖
 */
const pageConfig = reactive({
  api: {
    getOrder,
    orderItemList,
    getPassengerIdCard,
    getPassengerPhone,
    receiptOrderItem,
    refundOrderItem,
    refund: refundOrder,
    cancel: cancelOrder
  },
  authorites: {
    refund: 'ticket:order:refund',
    cancel: 'ticket:order:cancel',
    itemReceipt: 'ticket:orderItem:delivery',
    itemRefund: 'ticket:orderItem:refund'
  }
});

const orderItemCount = ref<number>(0);
const orderItems = ref<OrderItemVO[]>();
const orderInfo = ref<OrderVO>({
  buyer: {},
  route: {},
  routeSku: {},
  car: {}
} as OrderVO);

const orderNo = computed(() => {
  return route.params.orderNo;
});

const getDetail = async () => {
  const res = await pageConfig.api.getOrder(orderNo.value as string);
  if (res.code === 200) {
    if (!res.data) return;
    orderInfo.value = res.data;
  }
};

const getOrderItems = async () => {
  const res = await pageConfig.api.orderItemList(orderNo.value as string);
  if (res.code === 200) {
    if (!res.data) return;
    orderItemCount.value = res.data.total;
    orderItems.value = res.data.items;
  }
};

const pageInit = async () => {
  openLoading('加载中');
  await getDetail();
  await getOrderItems();
  closeLoading();
};

onUnmounted(() => {
  ws.close();
});

watch(
  () => route.params,
  () => {
    if (orderNo.value) {
      pageInit();
      ws = new WebSocket(
        useGlobSettings().websocketUrl + `ws/app/order/${orderNo.value}`
      );
      ws.onmessage = (res) => {
        const { data } = res;
        const json = JSON.parse(data);
        const { type } = json;
        if (type === 'STATUS_CHANGE') {
          pageInit();
        }
      };
    }
  },
  { immediate: true }
);

const goBack = () => {
  router.push('/ticket/order');
};

const processViewEncryptField = (opt: {
  visibleKey: string;
  key: string;
  api: (passengerId: number) => Promise<R<string>>;
  row: OrderItemVO;
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

const triggerViewIdCard = (row: OrderItemVO) => {
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

const triggerViewPhone = (row: OrderItemVO) => {
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

function cancelOrderFn() {
  ElMessageBox.confirm(`取消订单后，将无法进行“支付”，确定取消吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      pageConfig.api.cancel(orderNo.value as string).then((res) => {
        if (res.code === 200) {
          ElMessage.success('订单取消成功');
        }
      });
    })
    .catch(() => {});
}

function refundOrderFn() {
  ElMessageBox.confirm(
    `提交退款后，将退款${fenToYuan(orderInfo.value.payAmount - orderInfo.value.refundAmount)}元给用户，确定退款吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(() => {
      pageConfig.api.refund(orderNo.value as string).then((res) => {
        if (res.code === 200) {
          ElMessage.success('订单提交退款成功');
        }
      });
    })
    .catch(() => {});
}

function receiptOrderItemFn(row: OrderItemVO) {
  ElMessageBox.confirm(`确认出行后，此订单项将无法发起“退款”，确认出行吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      pageConfig.api
        .receiptOrderItem({
          orderNo: orderNo.value as string,
          orderItemId: row.orderItemId
        })
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success('确认出行成功');
          }
        });
    })
    .catch(() => {});
}

function refundOrderItemFn(row: OrderItemVO) {
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
          orderNo: orderNo.value as string,
          orderItemId: row.orderItemId
        })
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success('提交退款成功');
          }
        });
    })
    .catch(() => {});
}
</script>

<style lang="scss" scoped>
:deep(.el-form-item) {
  margin-bottom: 0px;
}
.info-wrap {
  .title-wrap {
    display: flex;
    align-items: center;
    height: 24px;
    &::before {
      content: ' ';
      margin-right: 5px;
      width: 2px;
      height: 18px;
      background-color: #1975ff;
      transform: translateY(1px);
    }
  }
  .content-wrap {
    margin-top: 10px;
  }
  .info-table {
    margin-bottom: 20px;
    width: 100%;
    font-size: 12px;
    border-spacing: 0;
    border-collapse: collapse;
    border: 1px solid #ebebeb;
    thead {
      background-color: #f7f8fa;
    }
    // tr {
    //   line-height: 22px;
    // }
    th {
      color: rgba(0, 0, 0, 0.8);
      font-weight: 400;
      text-align: left;
      border-right: 1px solid #ebebeb;
      border-bottom: 1px solid #ebebeb;
    }

    th,
    td {
      padding: 9px 12px;
    }
    td {
      border-right: 1px solid #ebebeb;
      border-bottom: 1px solid #ebebeb;
    }
  }
}

.price-wrap {
  font-size: 14px;
  text-align: right;
  .price {
    // font-size: 42px;
    font-size: 16px;
    font-weight: bold;
  }
}

.finish-price {
  font-size: 14px;

  .price {
    font-size: 28px;
    color: #f02e2e;
  }
}
</style>
