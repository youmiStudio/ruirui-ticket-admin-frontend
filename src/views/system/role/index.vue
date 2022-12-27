<template>
  <div class="app-container">
    <el-card class="mb-10px" shadow="never">
      <el-form ref="searchFormRef" :model="searchForm">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="角色名称" prop="siteName">
              <el-input
                v-model="searchForm.roleName"
                placeholder="请输入角色名称"
                clearable
                maxlength="20"
                @clear="search"
                @change="search"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="状态" prop="status">
              <el-select
                class="w100%"
                v-model="searchForm.status"
                placeholder="角色状态"
                @change="search"
              >
                <el-option label="全部" value=""></el-option>
                <el-option
                  v-for="dict in dicts.type.sys_common_status"
                  :label="dict.label"
                  :value="dict.value"
                  :key="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <el-button type="primary" :icon="Search" @click="search"
                >查询</el-button
              >
              <el-button :icon="Refresh" @click="searchRefresh">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            v-authority="[pageConfig.authorites.add]"
            type="primary"
            plain
            size="small"
            :icon="Plus"
            @click="handleAdd"
            >新增</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            v-authority="[pageConfig.authorites.remove]"
            type="danger"
            plain
            size="small"
            :icon="Delete"
            :disabled="batchDeleteDisable"
            @click="handleBatchDelete"
            >删除</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            v-authority="[pageConfig.authorites.export]"
            type="warning"
            plain
            size="small"
            :icon="Download"
            @click="handleExport"
            >导出</el-button
          >
        </el-col>
      </el-row>

      <TablePanel
        ref="tableRef"
        :url="fetchList"
        :primary-key="pageConfig.id"
        @select-change="handleTableSelectChange"
      >
        <el-table-column
          label="角色编号"
          prop="roleId"
          sortable="custom"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="角色名称"
          prop="roleName"
          align="center"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          label="权限字符"
          prop="roleKey"
          align="center"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          label="显示顺序"
          prop="roleSort"
          align="center"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template #default="{ row }">
            <DictTag
              :options="dicts.type.sys_common_status"
              :value="row.status"
            ></DictTag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="150px" align="center">
          <template #default="{ row }">
            <span>{{
              row.createTime && parseTime(row.createTime, '{y}-{m}-{d} {h}:{i}')
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="备注"
          prop="remark"
          align="center"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          width="200px"
          label="操作"
          align="center"
          class-name="fixed-width"
        >
          <template #default="{ row }">
            <div class="flex align-center" v-if="row.roleId !== 1">
              <el-button
                v-authority="[pageConfig.authorites.edit]"
                size="small"
                link
                type="primary"
                :icon="Edit"
                @click.stop="handleEdit(row)"
                >修改</el-button
              >
              <el-button
                v-authority="[pageConfig.authorites.remove]"
                link
                size="small"
                type="danger"
                :key="row[pageConfig.id]"
                :icon="Delete"
                @click.stop="handleRowDelete(row)"
                >删除</el-button
              >

              <el-dropdown
                class="ml12px"
                @command="(command: string)=>handleCommand(command,row)"
              >
                <el-button link size="small" type="primary" :icon="DArrowRight"
                  >更多</el-button
                >
                <template #dropdown>
                  <el-dropdown-menu>
                    <div v-authority="[pageConfig.authorites.edit]">
                      <el-dropdown-item
                        command="handleAuthUser"
                        :icon="CircleCheck"
                        >分配用户</el-dropdown-item
                      >
                    </div>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
        </el-table-column>
      </TablePanel>
    </el-card>

    <el-dialog
      v-model="dialogState.dialogVisible"
      :title="dialogState.title"
      width="500px"
      append-to-body
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="角色名称" prop="roleName">
              <el-input
                v-model="form.roleName"
                placeholder="请输入角色名称"
                maxlength="20"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="权限字符" prop="roleKey">
              <template #label>
                <span>
                  <el-tooltip
                    content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasRole('admin')`)"
                    placement="top"
                  >
                    <el-icon :size="14"><QuestionFilled /></el-icon>
                  </el-tooltip>
                  权限字符
                </span>
              </template>

              <el-input
                v-model="form.roleKey"
                placeholder="请输入权限字符"
                maxlength="20"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="角色顺序" prop="roleSort">
              <el-input-number
                v-model="form.roleSort"
                controls-position="right"
                :min="0"
              />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item class="form-block" label="菜单权限">
              <el-checkbox
                v-model="menuExpand"
                @change="handleCheckedTreeExpand"
                >展开/折叠</el-checkbox
              >
              <el-checkbox
                v-model="menuNodeAll"
                @change="handleCheckedTreeNodeAll"
                >全选/全不选</el-checkbox
              >
              <el-checkbox v-model="form.menuCheckStrictly"
                >父子联动</el-checkbox
              >
              <el-tree
                class="tree-border"
                :data="menuOptions"
                show-checkbox
                ref="menu"
                node-key="id"
                :check-strictly="!form.menuCheckStrictly"
                empty-text="加载中，请稍候"
                :props="defaultProps"
              ></el-tree> </el-form-item
          ></el-col>

          <el-col :span="24">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in dicts.type.sys_common_status"
                  :key="dict.value"
                  :label="dict.value"
                  >{{ dict.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input
                v-model="form.remark"
                placeholder="请输入内容"
                type="textarea"
                :row="2"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="submitForm" :loading="formLoading">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {
  Search,
  Refresh,
  Plus,
  Edit,
  Delete,
  Download,
  QuestionFilled,
  CircleCheck,
  DArrowRight
} from '@element-plus/icons-vue';
import TablePanel from '@/components/TablePanel/index.vue';
import useDictTypes from '@/hooks/web/useDictTypes';
import {
  roleList,
  getRole,
  addRole,
  editRole,
  removeRole,
  exportRole
} from '@/api/role/index';
import { getRoleMenuTreeSelect, getTreeSelect } from '@/api/menu/index';
import { parseTime } from '@/utils';
import type {
  FormInstance,
  FormRules,
  CheckboxValueType,
  ElTree
} from 'element-plus';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useDebounceFn } from '@vueuse/shared';
import { vAuthority } from '@/directive/authority';
import type {
  RoleSearchBody,
  RoleVo,
  RoleAddAndEditBody
} from '@/api/role/types';
import type { MenuSelectVo } from '@/api/menu/types';
import type Node from 'element-plus/es/components/tree/src/model/node';
import { TreeKey } from 'element-plus/es/components/tree/src/tree.type';

type TreeType = InstanceType<typeof ElTree>;

type ModelSearchBody = RoleSearchBody;
type ModelBody = RoleAddAndEditBody;
type ModelVo = RoleVo;

/**
 * 页面配置，抽离公共部分，少搬点砖
 */
const pageConfig = reactive({
  title: '角色',
  id: 'roleId',
  isAsc: 'desc',
  orderByColumn: 'role_id',
  api: {
    list: roleList,
    get: getRole,
    add: addRole,
    remove: removeRole,
    edit: editRole,
    export: exportRole
  },
  authorites: {
    list: 'system:role:list',
    get: 'system:role:query',
    add: 'system:role:add',
    edit: 'system:role:edit',
    remove: 'system:role:remove',
    export: 'system:role:export'
  }
});

const dicts = useDictTypes('sys_common_status');
const tableRef = ref<InstanceType<typeof TablePanel>>();
const formRef = ref<FormInstance>();
const searchFormRef = ref<FormInstance>();
const formLoading = ref<boolean>(false);
const batchDeleteDisable = ref<boolean>(true);
const tableRecordRows = ref<ModelVo[]>([]);

const searchForm = reactive<ModelSearchBody>({
  roleName: '',
  status: ''
});

const rules = reactive<FormRules>({
  roleName: [
    { required: true, message: '角色名称不能为空', trigger: 'blur' },
    {
      min: 2,
      max: 20,
      message: '角色名称长度必须介于 2 和 20 之间',
      trigger: 'blur'
    }
  ],
  roleKey: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }],
  roleSort: [{ required: true, message: '角色顺序不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '状态必须选择', trigger: 'blur' }]
});

let form = reactive<ModelBody>({
  roleId: null,
  roleName: '',
  roleKey: '',
  roleSort: 1,
  status: '0',
  remark: '',
  menuCheckStrictly: false
});

const dialogState = reactive({
  title: '',
  dialogVisible: false
});

onMounted(() => {
  search();
});

watch(
  tableRecordRows,
  (rows) => {
    switchBatchDelete(rows.length);
  },
  { deep: true }
);

const search = useDebounceFn(() => {
  tableRef.value && tableRef.value.search({ ...searchForm });
}, 200);

function switchBatchDelete(selectRowsLength: number) {
  if (selectRowsLength > 0) {
    batchDeleteDisable.value = false;
    return;
  }
  batchDeleteDisable.value = true;
}

function handleTableSelectChange(recordRows: any[]) {
  tableRecordRows.value = recordRows;
}

function fetchList(obj: ModelBody) {
  return pageConfig.api.list({
    ...obj,
    orderByColumn: pageConfig.orderByColumn,
    isAsc: pageConfig.isAsc
  });
}

function handleAdd() {
  formReset();
  dialogState.title = `添加${pageConfig.title}`;
  dialogState.dialogVisible = true;
  getMenuTreeSelect();
}

function handleEdit(row: any) {
  formReset();
  dialogState.title = `修改${pageConfig.title}`;
  dialogState.dialogVisible = true;
  getDetail(row[pageConfig.id]).then((data) => {
    Object.keys(form).forEach((key) => {
      if (key in data) {
        form[key] = data[key];
      }
    });
    getMenuTreeSelectByRole(row.roleId);
  });
}

function handleExport() {
  pageConfig.api.export(searchForm);
}

function getDetail(id: number): Promise<ModelVo> {
  return new Promise((resolve, reject) => {
    pageConfig.api.get(id).then((res) => {
      const { data } = res;
      if (data) {
        resolve(data);
      }
    });
  });
}

function handleRowDelete(row: any) {
  batchDelete(row[pageConfig.id]).then(() => {
    search();
    ElMessage.success('删除成功');
  });
}

function handleBatchDelete() {
  const ids = tableRecordRows.value.map((row) => row[pageConfig.id]);
  batchDelete(ids.join(',')).then(() => {
    search();
    ElMessage.success('删除成功');
  });
}

function batchDelete(ids: string) {
  return new Promise((resolve, reject) => {
    ElMessageBox.confirm(
      `确定要删除${pageConfig.title}编号[${ids}]的数据项吗？`,
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
      .then(() => {
        pageConfig.api.remove(ids).then((res) => {
          const { code } = res;
          if (code === 200) {
            resolve(res);
          } else {
            reject(res);
          }
        });
      })
      .catch(() => {});
  });
}

function clearTableRecordRows() {
  if (!tableRef.value) return;
  tableRef.value.clearRecord();
}

function formReset() {
  formRef.value?.resetFields();
  Object.keys(form).forEach((key) => {
    form[key] = null;
  });
  form.status = '0';
  form.roleSort = 1;
  form.menuCheckStrictly = true;
  menuExpand.value = false;
  menuNodeAll.value = false;
  if (menu.value) {
    menu.value.setCheckedKeys([]);
  }
}

function searchReset() {
  searchFormRef.value?.resetFields();
}

function searchRefresh() {
  searchReset();
  search();
}

function submitForm() {
  formRef.value?.validate((valid) => {
    if (valid) {
      formLoading.value = true;

      const isAdd = form[pageConfig.id] === null;
      const api = isAdd ? pageConfig.api.add : pageConfig.api.edit;
      form['menuIds'] = getMenuAllCheckedKeys();
      api(form).then((res) => {
        const { code } = res;
        if (code !== 200) {
          formLoading.value = false;
          return;
        }
        search();
        formReset();
        dialogState.dialogVisible = false;
        formLoading.value = false;
        ElMessage.success(`${pageConfig.title}${isAdd ? '新增' : '编辑'}成功`);
      });
    }
  });
}

function cancel() {
  dialogState.dialogVisible = false;
  formReset();
}

/**
 * ===============额外功能开始=================
 */
const menuExpand = ref<boolean>();
const menuNodeAll = ref<boolean>();
const menuOptions = ref<MenuSelectVo[]>();
const defaultProps = ref({
  children: 'children',
  label: 'label'
});
const menu = ref<TreeType>();

const $router = useRouter()

const instance = getCurrentInstance();

defineExpose({ handleAuthUser });


function getMenuTreeSelect() {
  getTreeSelect().then((res) => {
    menuOptions.value = res.data;
  });
}

function getMenuTreeSelectByRole(roleId: number) {
  getRoleMenuTreeSelect(roleId).then((res) => {
    const { data } = res;
    if (data) {
      const { checkedKeys, menus } = data;
      menuOptions.value = menus;
      checkedKeys.forEach((v) => {
        nextTick(() => {
          menu.value && menu.value.setChecked(v, true, false);
        });
      });
    }
  });
}

function handleCheckedTreeExpand(flag: CheckboxValueType) {
  let treeList = menuOptions.value;
  if (!treeList) return;
  for (let i = 0; i < treeList.length; i++) {
    if (!menu.value) return;
    menu.value.store.nodesMap[treeList[i].id].expanded = flag as boolean;
  }
}

function handleCheckedTreeNodeAll(flag: CheckboxValueType) {
  menu.value &&
    menu.value.setCheckedNodes(
      (flag as boolean) ? (menuOptions.value as Node[]) : []
    );
}

// 所有菜单节点数据
function getMenuAllCheckedKeys(): TreeKey[] {
  if (!menu.value) return [];
  // 目前被选中的菜单节点
  let checkedKeys = menu.value.getCheckedKeys();
  // 半选中的菜单节点
  let halfCheckedKeys = menu.value.getHalfCheckedKeys();
  checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
  return checkedKeys;
}

function handleCommand(command: string, row: ModelVo) {
  const { exposed } = instance as any;

  exposed[command](row);
}

/** 分配角色操作 */
function handleAuthUser(row: ModelVo) {
  const userId = row.roleId;
  $router.push('/system/role-auth/user/' + userId);
}

/**
 * ===============额外功能结束=================
 */
</script>

<style lang="scss" scoped>
.form-block {
  ::v-deep .el-form-item__content {
    display: block;
  }
}
</style>
