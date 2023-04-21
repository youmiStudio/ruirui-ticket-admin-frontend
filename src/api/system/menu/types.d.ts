import { BaseSearchBody, BaseVo } from '@/api/types';

/**
 * 菜单类型
 */
enum MenuType {
  /**
   * 目录类型
   */
  DIRECTORY = 'M',
  /**
   * 菜单类型
   */
  MENU = 'C',
  /**
   * 按钮类型
   */
  BUTTON = 'F'
}

type MenuVo = {
  /**
   * 菜单ID
   */
  menuId: number;
  /**
   * 菜单名称
   */
  menuName: string;
  /**
   * 父菜单ID
   */
  parentId: number;
  /**
   * 显示顺序
   */
  orderNum: number;
  /**
   * 路由地址
   */
  path: string;
  /**
   * Vue组件路径
   */
  component: string;
  /**
   * 路由参数
   */
  query: string;
  /**
   * 是否外链（0是 1不否）
   */
  isFrame: string;
  /**
   * 是否缓存（0缓存 1 不缓存）
   */
  isCache: string;
  /**
   * 菜单类型
   */
  menuType: string;
  /**
   * 菜单是否隐藏（0显示 1隐藏）
   */
  visible: string;
  /**
   * 菜单状态（0正常 1停用）
   */
  status: string;
  /**
   * 权限标识
   */
  perms: string;
  /**
   * 菜单图标
   */
  icon: string;
} & BaseVo;

type MenuSelectVo = {
  id: number;
  label: string;
};

type MenuAddAndEditBody = Partial<Omit<MenuVo, BaseVo>>;

type MenuSearchBody = Partial<Pick<MenuVo, 'menuName' | 'status'>> &
  BaseSearchBody;

type MenuRoleSelectVo = {
  checkedKeys:number[],
  menus:MenuSelectVo[]
}