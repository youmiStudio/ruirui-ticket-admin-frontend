<template>
  <section-box title="流量数据" :subTitle="`(统计时间：2023-03-14)`">
    <template #cmd>
      <date-picker :data="datePickerList"></date-picker>
    </template>

    <line-chart :chartData="lineData"></line-chart>
  </section-box>
</template>

<script lang="ts" setup>
import SectionBox from '@/components/SectionBox/index.vue';
import DatePicker from '@/components/DatePicker/index.vue';
import type { DatePickerItem } from '@/components/DatePicker/types';

import LineChart from './LineChart.vue';

const date = [
  '2023-03-08',
  '2023-03-09',
  '2023-03-10',
  '2023-03-11',
  '2023-03-12',
  '2023-03-13',
  '2023-03-14'
];

const lineData = ref([
  {
    label: '路线访客数',
    date: date,
    value: [0, 0, 0, 0, 0, 1, 2],
    color: '#1975ff'
  },
  {
    label: '路线浏览数',
    date: date,
    value: [0, 0, 0, 0, 0, 3, 7],
    color: '#2fc25b'
  }
]);

const datePickerList = ref<DatePickerItem[]>([
  {
    type: 'text',
    label: '昨日'
  },
  {
    type: 'text',
    label: '近7天'
  },
  {
    type: 'text',
    label: '近30日'
  },
  {
    type: 'date',
    label: '日'
  }
]);
</script>

<style lang="scss" scoped></style>
