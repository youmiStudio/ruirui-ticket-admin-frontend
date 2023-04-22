<template>
  <div class="app-container">
    <el-button :icon="ArrowLeft" size="small" @click="goBack">返回</el-button>
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
            <el-form-item label="订单来源"> 小程序端 </el-form-item>
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
            <el-form-item label="出行人数"> 1 </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="支付方式">
              {{ orderInfo.payAmount ? '微信支付' : '-' }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="支付时间">
              {{ orderInfo.paymentTime ? orderInfo.paymentTime : '-' }}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="下单时间">
              {{ orderInfo.orderTime ? orderInfo.orderTime : '-' }}
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
              <col style="width: 15%" />
              <col style="width: 15%" />
              <col style="width: 15%" />
            </colgroup>
            <thead>
              <tr>
                <th>姓名</th>
                <th>证件类型</th>
                <th>证件号码</th>
                <th>手机号码</th>
                <th>座位名称</th>
                <th>座位描述</th>
                <th>选座情况</th>
                <th>核销二维码</th>
                <th>单价(元)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td> 李浩辉 </td>
                <td>
                  <span>身份证</span>
                </td>
                <td>
                  <span>4466**********3333</span>
                  <span class="ml-3px link">查看</span>
                </td>
                <td>
                  <span>131****1111</span>
                  <span class="ml-3px link">查看</span>
                </td>
                <td>
                  <span>一等座</span>
                </td>
                <td>
                  <span>非常舒服的座位</span>
                </td>
                <td>
                  <span class="link">点击查看</span>
                </td>
                <td>
                  <span class="link">点击查看</span>
                </td>
                <td>
                  <span>88.88</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="price-wrap">
        <span class="mr-3px">总金额:</span>
        <span class="price">{{ fenToYuan(orderInfo.payAmount) }}</span>
        <span class="ml-3px">元</span>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ArrowLeft } from '@element-plus/icons-vue';

import { getOrder } from '@/api/business/order/index';
import { OrderVO } from '~/api/business/order/types';

import { fenToYuan } from '@/utils/price';

const route = useRoute();
const router = useRouter();

const orderInfo = ref<OrderVO>({
  buyer: {},
  route: {},
  routeSku: {},
  car: {}
} as OrderVO);

const orderNo = computed(() => {
  return route.params.orderNo;
});

const getDetail = () => {
  getOrder(orderNo.value as string).then((res) => {
    if (res.code === 200) {
      if (!res.data) return;
      orderInfo.value = res.data;
    }
  });
};

watch(
  () => route.params,
  () => {
    if (orderNo.value) {
      getDetail();
    }
  },
  { immediate: true }
);

const goBack = () => {
  router.push('/ticket/order');
};
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
</style>
