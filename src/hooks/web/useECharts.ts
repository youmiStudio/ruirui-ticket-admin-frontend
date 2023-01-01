import type { EChartsOption } from 'echarts';
import type { Ref } from 'vue';
import { useTimeoutFn } from '@/hooks/core/useTimeout';
import { tryOnUnmounted, tryOnMounted } from '@vueuse/core';
import { unref, nextTick, watch, computed, ref } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import { useEventListener } from '@/hooks/event/useEventListener';
import echarts from '@/utils/lib/echarts';
import 'echarts/theme/macarons';

export function useECharts(
  elRef: Ref<HTMLDivElement>,
  theme: 'light' | 'dark' | 'default' | 'macarons' = 'default'
) {
  let chartInstance: echarts.ECharts | null = null;
  let resizeFn: Fn = resize;
  const cacheOptions = ref({}) as Ref<EChartsOption>;
  let removeResizeFn: Fn = () => {};
  let removeSideBarResizeFn: Fn = () => {};

  resizeFn = useDebounceFn(resize, 200);

  const getOptions = computed(() => {
    // if (getDarkMode.value !== 'dark') {
    //   return cacheOptions.value as EChartsOption;
    // }
    // other theme.
    // return {
    //   backgroundColor: 'transparent',
    //   ...cacheOptions.value,
    // } as EChartsOption;
    return cacheOptions.value as EChartsOption;
  });

  function initCharts(t = theme) {
    const el = unref(elRef);
    if (!el || !unref(el)) {
      return;
    }

    chartInstance = echarts.init(el, t);
    const { removeEvent } = useEventListener({
      el: window,
      eventType: 'resize',
      listener: resizeFn
    });

    tryOnMounted(() => {
      const $_sidebarElm =
        document.getElementsByClassName('sidebar-container')[0];
      if ($_sidebarElm) {
        const { removeEvent } = useEventListener({
          el: $_sidebarElm,
          eventType: 'transitionend',
          listener: resizeFn
        });
        removeSideBarResizeFn = removeEvent;
      }
    });

    removeResizeFn = removeEvent;

    useTimeoutFn(() => {
      resizeFn();
    }, 30);
  }

  function setOptions(options: EChartsOption, clear = false) {
    cacheOptions.value = options;
    if (unref(elRef)?.offsetHeight === 0) {
      useTimeoutFn(() => {
        setOptions(unref(getOptions));
      }, 30);
      return;
    }
    nextTick(() => {
      useTimeoutFn(() => {
        if (!chartInstance) {
          initCharts(theme);
          if (!chartInstance) return;
        }
        clear && chartInstance?.clear();
        chartInstance?.setOption(unref(getOptions));
      }, 30);
    });
  }

  function resize() {
    chartInstance?.resize({
      animation: {
        duration: 300,
        easing: 'quadraticIn'
      }
    });
  }

  function sidebarResize(e: any) {
    if (e.propertyName === 'width') {
      useTimeoutFn(() => {
        resizeFn();
      }, 30);
    }
  }

  tryOnUnmounted(() => {
    if (!chartInstance) return;
    removeResizeFn();
    removeSideBarResizeFn();
    chartInstance.dispose();
    chartInstance = null;
  });

  function getInstance(): echarts.ECharts | null {
    if (!chartInstance) {
      initCharts('default');
    }
    return chartInstance;
  }

  return {
    setOptions,
    resize,
    echarts,
    getInstance
  };
}
