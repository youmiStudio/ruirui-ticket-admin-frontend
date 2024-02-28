import { useUserStore } from '@/store';
import { storeToRefs } from 'pinia';

const userStore = useUserStore();

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export default function checkPermission(value: any[]) {
  if (value && value instanceof Array && value.length > 0) {
    const roles = userStore.roles;

    const permissionRoles = value;

    const hasPermission =
      roles &&
      roles.some((role) => {
        return permissionRoles.includes(role);
      });
    return hasPermission;
  } else {
    console.error(`need roles! Like v-permission="['admin','editor']"`);
    return false;
  }
}

export function checkAuthority(value: string[]) {
  if (value && value instanceof Array && value.length > 0) {
    const { authorities } = storeToRefs(userStore);
    const allPermission = '*:*:*';

    if (!authorities?.value) return false;
    const hasAuthority =
      authorities.value.includes(allPermission) ||
      authorities.value.some((authority) => {
        return value.includes(authority);
      });

    return hasAuthority;
  } else {
    console.error(`Need Authority! Like v-permission="['system:user:info']"`);
    return false;
  }
}
