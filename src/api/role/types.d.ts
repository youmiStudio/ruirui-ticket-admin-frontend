import { BaseVo } from '@/api/types';

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
  roleSort: string;
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
  menuIds: number[];
} & BaseVo;

/**
 * 角色管理查询请求体
 */
type RoleSearchBody = Partial<Pick<RoleVo, 'roleName' | 'roleKey' | 'status'>>;

type RoleAddAndEditBody = Pick<RoleVo,"roleId" | "roleName" | "roleKey" | "roleSort" | "menuIds">

