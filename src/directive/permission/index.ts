import type { Directive } from 'vue';
import { useUserStore } from '@/store';
import { storeToRefs } from 'pinia';

const userStore = useUserStore();

export const vPermission: Directive = {
  mounted: (el, binding, vnode, prevVnode) => {
    const { value } = binding;
    const { roles } = storeToRefs(userStore);

    if (roles?.value && value && value instanceof Array) {
      if (value.length > 0) {
        const permissionRoles = value;

        // console.log(roles);
        const hasPermission = roles.value.some((role) => {
          return permissionRoles.includes(role);
        });

        if (!hasPermission) {
          el.parentNode && el.parentNode.removeChild(el);
        }
      }
    } else {
      throw new Error(`need roles! Like v-permission="['admin','editor']"`);
    }
  }
};
