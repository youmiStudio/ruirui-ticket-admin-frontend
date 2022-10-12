<template>
  <div ref="chartRef" :style="{ height, width }"></div>
</template>

<script lang="ts" setup>
import { useECharts } from '@/hooks/web/useECharts';
import { Ref } from 'vue';
const props = defineProps({
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '350px'
  },
  chartData: {
    type: Object,
    required: true
  }
});

const chartRef = ref<HTMLDivElement | null>(null);
const { setOptions, echarts } = useECharts(
  chartRef as Ref<HTMLDivElement>,
  'macarons'
);

setChartOptions(props.chartData);

function setChartOptions(options: any) {
  const { expectedData, actualData } = options;
  setOptions({
    xAxis: {
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      boundaryGap: false,
      axisTick: {
        show: false
      }
    },
    grid: {
      left: 10,
      right: 10,
      bottom: 20,
      top: 30,
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      },
      padding: [5, 10]
    },
    yAxis: {
      axisTick: {
        show: false
      }
    },
    legend: {
      data: ['expected', 'actual']
    },
    series: [
      {
        name: 'expected',
        color: '#FF005A',
        lineStyle: {
          color: '#FF005A',
          width: 2
        },
        smooth: true,
        type: 'line',
        data: expectedData,
        animationDuration: 2800,
        animationEasing: 'cubicInOut'
      },
      {
        name: 'actual',
        smooth: true,
        type: 'line',
        color: '#3888fa',
        lineStyle: {
          color: '#3888fa',
          width: 2
        },
        areaStyle: {
          color: '#f3f8ff'
        },
        data: actualData,
        animationDuration: 2800,
        animationEasing: 'quadraticOut'
      }
    ]
  });
}
</script>

<style lang="scss" scoped></style>
