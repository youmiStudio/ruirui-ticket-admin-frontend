import { defineStore } from 'pinia';
import Cookies from 'js-cookie';

export const useAppStore = defineStore({
  id: 'app',
  state: (): AppStoreState => ({
    sidebar: {
      opened: Cookies.get('sidebarStatus')
        ? !!+(Cookies.get('sidebarStatus') as string)
        : true,
      withoutAnimation: false
    },
    device: 'desktop'
  }),
  getters: {},
  actions: {
    toggleSideBar() {
      this.sidebar.opened = !this.sidebar.opened;
      this.sidebar.withoutAnimation = false;
      if (this.sidebar.opened) {
        Cookies.set('sidebarStatus', '1');
      } else {
        Cookies.set('sidebarStatus', '0');
      }
    },
    closeSideBar(object: { withoutAnimation: boolean }) {
      Cookies.set('sidebarStatus', '0');
      this.sidebar.opened = false;
      this.sidebar.withoutAnimation = object.withoutAnimation;
    },
    toggleDevice(device: string) {
      this.device = device;
    }
  }
});
