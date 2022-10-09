import { watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAppStore } from '@/store';
import { storeToRefs } from 'pinia';

const { body } = document;
const WIDTH = 992; // refer to Bootstrap's responsive design

export function useResizeHandler() {
  const route = useRoute();
  const appStore = useAppStore();

  const { sidebar, device } = storeToRefs(appStore);

  watch(
    route,
    (r) => {
      if (device.value === 'mobile' && sidebar.value.opened) {
        appStore.closeSideBar({ withoutAnimation: false });
      }
    },
    { immediate: true }
  );

  onBeforeMount(() => {
    window.addEventListener('resize', $_resizeHandler);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', $_resizeHandler);
  });

  function $_isMobile() {
    const rect = body.getBoundingClientRect();
    return rect.width - 1 < WIDTH;
  }

  function $_resizeHandler() {
    if (!document.hidden) {
      const isMobile = $_isMobile();

      appStore.toggleDevice(isMobile ? 'mobile' : 'desktop');
      if (isMobile) {
        appStore.closeSideBar({ withoutAnimation: true });
      }
    }
  }
}
