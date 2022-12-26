import { BaseSearchBody, BaseVo } from '@/api/types';
import { TreeKey } from 'element-plus/es/components/tree/src/tree.type';

/**
 * 角色返回对象
 */
type RoleVo = {
  /**
   * 角色Id
   */
  roleId: stinrg | number;

  /**
   * 角色名称
   */
  roleName: string;
  /**
   * 角色权限标识
   */
  roleKey: string;
  /**
   * 显示顺序
   */
  roleSort: number;
  /**
   * 角色状态
   */
  status: string;
  /**
   * 用户是否存在此角色标识 默认不存在
   */
  flag: string;

  /**
   * 菜单组
   */
  menuIds: TreeKey[];

  /**
   * 菜单严格检查
   */
  menuCheckStrictly: boolean;
} & BaseVo;

/**
 * 角色管理查询请求体
 */
type RoleSearchBody = Partial<
  Pick<RoleVo, 'roleName' | 'roleKey' | 'status' | 'roleId'>
> &
  BaseSearchBody;

type RoleAddAndEditBody = Partial<
  Pick<
    RoleVo,
    | 'roleId'
    | 'roleName'
    | 'roleKey'
    | 'roleSort'
    | 'menuIds'
    | 'status'
    | 'remark'
    | 'menuCheckStrictly'
  >
>;
