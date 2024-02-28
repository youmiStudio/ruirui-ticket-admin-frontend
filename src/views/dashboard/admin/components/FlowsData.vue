<template>
  <section-box
    title="流量数据"
    :subTitle="`(统计时间：${
      beginDate === endDate ? endDate : beginDate + ' - ' + endDate
    })`"
  >
    <template #cmd>
      <date-picker :data="datePickerList" @click="onClick"></date-picker>
    </template>

    <line-chart :chartData="lineData"></line-chart>
  </section-box>
</template>

<script lang="ts" setup>
import moment, { Moment } from 'moment';

const nowMoment = moment(new Date());

import SectionBox from '@/components/SectionBox/index.vue';
import DatePicker from '@/components/DatePicker/index.vue';
import type { DatePickerItem } from '@/components/DatePicker/types';

import LineChart from './LineChart.vue';

import * as ANALYSIS_API from '@/api/business/analysis';

const beginDate = ref<string>();
const endDate = ref<string>();

const date = ref<string[]>([]);
const ips = ref<number[]>([]);
const uvs = ref<number[]>([]);

const lineData = ref([
  {
    label: '路线访客数',
    date: date,
    value: ips,
    color: '#1975ff'
  },
  {
    label: '路线浏览数',
    date: date,
    value: uvs,
    color: '#2fc25b'
  }
]);

const datePickerList = ref<DatePickerItem[]>([
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
    label: '日',
    disabledDate: (date: Date) => {
      return !moment(date).isBefore(nowMoment.clone().subtract(1, 'd'));
    }
  }
]);

const getDate = () => {
  const convertArray = (data: any, key: string, format?: Function) => {
    const arr: any[] = [];
    date.value.forEach((date) => {
      if (format && typeof format === 'function') {
        arr.push(format(data![date][key]));
      } else {
        arr.push(data![date][key]);
      }
    });
    return arr;
  };

  ANALYSIS_API.flows({
    beginDate: beginDate.value!,
    endDate: endDate.value!
  }).then((res) => {
    const { data } = res;
    date.value = Object.keys(data!).sort((a, b) =>
      moment(a).isBefore(moment(b)) ? -1 : 1
    ) as string[];

    ips.value = convertArray(data, 'ip');
    uvs.value = convertArray(data, 'uv');
  });
};

const onClick = (r: DatePickerItem) => {
  const dateFormat = (m: Moment) => {
    return m.format('YYYY-MM-DD');
  };
  endDate.value = dateFormat(nowMoment.clone().subtract(1, 'd'));
  if (r.label === '近7天') {
    beginDate.value = dateFormat(nowMoment.clone().subtract(7, 'd'));
  } else if (r.label === '近30日') {
    beginDate.value = dateFormat(nowMoment.clone().subtract(30, 'd'));
  } else if (r.label === '日') {
    beginDate.value = r.pickDate![0];
    endDate.value = r.pickDate![1];
  }

  getDate();
};
</script>

<style lang="scss" scoped></style>
