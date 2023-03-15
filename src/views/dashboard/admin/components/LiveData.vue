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
              <div> {{ item.label }} </div>
            </template>
          </el-statistic>
          <div class="statistic-footer">
            <div class="footer-item">
              <span>昨天{{ item.yesterday }}</span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </section-box>
</template>

<script lang="ts" setup>
import { parseTime } from '@/utils';
import SectionBox from '@/components/SectionBox/index.vue';

const currentTime = computed(() => {
  return new Date().getTime();
});

const list = ref([
  {
    label: '路线访客数',
    value: 6,
    yesterday: 2
  },
  {
    label: '路线浏览数',
    value: 22,
    yesterday: 7
  },
  {
    label: '创建订单数',
    value: 2,
    yesterday: 1
  },
  {
    label: '支付订单数',
    value: 1,
    yesterday: 0
  },
  {
    label: '支付金额',
    value: 88.88,
    yesterday: 0,
    precision: 2,
    suffix:'元'
  },
  {
    label: '支付转化率',
    value: 100,
    yesterday: 0,
    suffix:'%'
  }
]);
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
</style>
