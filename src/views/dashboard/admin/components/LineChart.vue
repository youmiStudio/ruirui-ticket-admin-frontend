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
const { setOptions } = useECharts(
  chartRef as Ref<HTMLDivElement>
  // 'macarons'
);

onMounted(() => {
  setChartOptions(props.chartData);
});

watch(
  () => props.chartData,
  (data) => {
    setChartOptions(data);
  },
  { deep: true }
);

function setChartOptions(options: any) {
  // const { createData, paymentNumber, paymentData } = options;
  const legendData = options.map((item: any) => item.label);
  const date = options[0].date;
  const series: any[] = [];
  options.forEach((item: any) => {
    const defaultStyle = {
      name: item.label,
      smooth: true,
      type: 'line',
      color: item.color,
      lineStyle: {
        color: item.color,
        width: 2
      },

      data: item.value,
      animationDuration: 2800,
      animationEasing: 'quadraticOut'
    };

    series.push(defaultStyle);
  });
  setOptions({
    xAxis: {
      data: date,
      boundaryGap: true,
      axisTick: {
        show: false
      }
    },
    grid: {
      left: 10,
      right: 10,
      bottom: 20,
      top: 40,
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
      icon: 'rect',
      itemWidth: 10,
      itemHeight: 10,
      left: 10,
      data: legendData
    },
    series: [...series]
  });
}
</script>

<style lang="scss" scoped></style>
