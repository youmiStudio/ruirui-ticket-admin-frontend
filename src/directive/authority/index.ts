import type { Directive } from 'vue';
import { useUserStore } from '@/store';
import { storeToRefs } from 'pinia';

const userStore = useUserStore();

export const vAuthority: Directive = {
  mounted: (el, binding, vnode, prevVnode) => {
    const { value } = binding;
    const { authorities } = storeToRefs(userStore);
    const allPermission = "*:*:*";

    if (authorities?.value && value && value instanceof Array) {

      if (value.length > 0) {
        const hasAuthority = authorities.value.includes(allPermission) ||authorities.value.some((authority) => {
          return value.includes(authority);
        });

        if (!hasAuthority) {
          el.parentNode && el.parentNode.removeChild(el);
        }
      }
    
    } else {
      throw new Error(
        `need authority! Like v-authority="['system:user:info','system:user:add']"`
      );
    }
  }
};
