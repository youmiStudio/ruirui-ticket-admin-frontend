<template>
  <section-box
    title="实时数据"
    :subTitle="`(统计时间：${parseTime(currentTime)})`"
  >
    <el-row class="statistic">
      <el-col
        class="statistic-item"
        :span="4"
        v-for="(item, index) in list"
        :key="index"
      >
        <div class="statistic-card">
          <el-statistic
            :value="item.value"
            :precision="item.precision"
            :suffix="item.suffix"
          >
            <template #title>
              <div class="flex items-center">
                <div class="mr-5px"> {{ item.label }} </div>
                <el-tooltip
                  v-if="item.tip"
                  class="box-item"
                  effect="dark"
                  :content="item.tip"
                  placement="top"
                >
                  <el-icon>
                    <WarningFilled />
                  </el-icon>
                </el-tooltip>
              </div>
            </template>
          </el-statistic>
          <div class="statistic-footer">
            <div class="footer-item">
              <span>昨天 {{ item.yesterday }}{{ item.suffix }} </span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </section-box>
</template>

<script lang="ts" setup>
import { WarningFilled } from '@element-plus/icons-vue';
import { parseTime } from '@/utils';
import SectionBox from '@/components/SectionBox/index.vue';

import * as ANALYSIS_API from '@/api/business/analysis';
import { fenToYuan } from '@/utils/price';

const currentTime = computed(() => {
  return new Date().getTime();
});

const list = ref([
  {
    flag: 'ip',
    label: '路线访客数',
    value: 0,
    yesterday: 0
  },
  {
    flag: 'uv',
    label: '路线浏览数',
    value: 0,
    yesterday: 0
  },
  {
    flag: 'payBuyerCount',
    label: '支付买家数',
    value: 0,
    yesterday: 0
  },
  {
    flag: 'orderCount',
    label: '创建订单数',
    value: 0,
    yesterday: 0
  },
  {
    flag: 'payOrderCount',
    label: '支付订单数',
    value: 0,
    yesterday: 0
  },
  {
    flag: 'refundOrderCount',
    label: '退款订单数',
    value: 0,
    yesterday: 0
  },
  {
    flag: 'writeOffReceiptCount',
    label: '核销出行数',
    value: 0,
    yesterday: 0
  },
  {
    flag: 'writeOffRefundCount',
    label: '核销退款数',
    value: 0,
    yesterday: 0
  },
  {
    flag: 'payAmount',
    label: '支付金额',
    value: 0,
    yesterday: 0,
    precision: 2,
    format: (v: number) => {
      return Number(fenToYuan(v));
    },
    suffix: '元'
  },
  {
    flag: 'refundAmount',
    label: '退款金额',
    value: 0,
    yesterday: 0,
    precision: 2,
    format: (v: number) => {
      return Number(fenToYuan(v));
    },
    suffix: '元'
  },
  {
    flag: 'payRate',
    label: '订单支付率',
    tip: '订单支付率 = 支付订单数 / 创建订单数',
    format: (v: number) => {
      if (!v) return 0;
      return v * 100;
    },
    value: 0,
    yesterday: 0,
    suffix: '%'
  },
  {
    flag: 'refundRate',
    label: '订单退款率',
    tip: '订单退款率 = 退款订单数 / 支付订单数',
    format: (v: number) => {
      if (!v) return 0;
      return v * 100;
    },
    value: 0,
    yesterday: 0,
    suffix: '%'
  }
]);

onMounted(() => {
  getDate();
});

const getDate = () => {
  ANALYSIS_API.realTime().then((res) => {
    const { data } = res;
    list.value.forEach((item) => {
      const flag = item.flag;

      item.value =
        item.format && typeof item.format === 'function'
          ? item.format(data?.today[flag])
          : data?.today[flag];
      item.yesterday =
        item.format && typeof item.format === 'function'
          ? item.format(data?.yesterday[flag])
          : data?.yesterday[flag];
    });
  });
};
</script>

<style lang="scss" scoped>
:global(h2#card-usage ~ .example .example-showcase) {
  background-color: var(--el-fill-color) !important;
}

.el-statistic {
  --el-statistic-content-font-size: 28px;
}

.statistic-card {
  height: 100%;

  border-radius: 4px;
  background-color: var(--el-bg-color-overlay);
  box-sizing: border-box;
}

.statistic-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  font-size: 12px;
  color: var(--el-text-color-regular);
  margin-top: 16px;
}

.statistic-footer .footer-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.statistic-footer .footer-item span:last-child {
  display: inline-flex;
  align-items: center;
}

.statistic {
  border: 1px solid #e8e8e8;
}

.statistic-item {
  margin: 24px 0;
  padding: 0 20px;
  border-right: 1px solid #e8e8e8;
  &:last-child {
    border-right: none;
  }
}

:deep(.el-statistic__content) {
  height: 34px;
}
</style>
