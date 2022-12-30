<template>
  <div class="app-container">
    <el-card class="mb-10px" shadow="never">
      <el-form ref="searchFormRef" :model="searchForm">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="菜单名称" prop="siteName">
              <el-input
                v-model="searchForm.menuName"
                placeholder="请输入菜单名称"
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
            type="info"
            plain
            size="small"
            :icon="Sort"
            @click="toggleExpandAll"
            >展开/折叠</el-button
          >
        </el-col>
      </el-row>

      <TablePanel
        v-if="refreshTable"
        ref="tableRef"
        row-key="menuId"
        :url="fetchList"
        :primary-key="pageConfig.id"
        :has-pagination="false"
        :selectType="false"
        :formatter="tableFormatter"
        :default-expand-all="isExpandAll"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column label="菜单名称" prop="menuName"> </el-table-column>
        <el-table-column width="70px" label="图标" align="center">
          <template #default="{ row }">
            <svg-icon :icon-class="row.icon"></svg-icon>
          </template>
        </el-table-column>
        <el-table-column width="70px" label="排序" prop="orderNum">
        </el-table-column>
        <el-table-column label="权限标识" prop="perms"> </el-table-column>
        <el-table-column label="组件路径" prop="component"> </el-table-column>
        <el-table-column width="75px" label="状态" align="center">
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
          width="200px"
          label="操作"
          align="center"
          class-name="fixed-width"
        >
          <template #default="{ row }">
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
              v-authority="[pageConfig.authorites.add]"
              size="small"
              link
              type="primary"
              :icon="Plus"
              @click.stop="handleAdd(row)"
              >新增</el-button
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
          </template>
        </el-table-column>
      </TablePanel>
    </el-card>

    <el-dialog
      v-model="dialogState.dialogVisible"
      :title="dialogState.title"
      width="680px"
      append-to-body
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级菜单" prop="parentId">
              <el-tree-select
                class="w100%"
                v-model="form.parentId"
                node-key="menuId"
                check-strictly
                :data="menuOptions"
                :props="treeSelectProps"
                :current-node-key="form.parentId"
                :default-expanded-keys="[form.parentId]"
                placeholder="选择上级菜单"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单类型" prop="menuType">
              <el-radio-group v-model="form.menuType">
                <el-radio label="M">目录</el-radio>
                <el-radio label="C">菜单</el-radio>
                <el-radio label="F">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="form.menuType != 'F'">
            <el-form-item label="菜单图标" prop="icon">
              <el-popover
                v-model:visible="iconPopoverVisible"
                placement="bottom-start"
                trigger="click"
                :width="460"
                @show="handlePopverShow"
              >
                <template #default>
                  <IconSelect ref="iconSelectRef" @selected="selected" />
                </template>
                <template #reference>
                  <el-input
                    v-model="form.icon"
                    placeholder="点击选择图标"
                    readonly
                  >
                    <template #prefix>
                      <svg-icon
                        v-if="form.icon"
                        :icon-class="form.icon"
                        class="el-input__icon"
                        style="height: 32px; width: 16px"
                      />
                      <el-icon v-else>
                        <Search />
                      </el-icon>
                    </template>
                    <template #suffix>
                      <el-icon v-if="form.icon">
                        <CircleClose @click.stop="handleIconClear" />
                      </el-icon>
                    </template>
                  </el-input>
                </template>
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model="form.menuName" placeholder="请输入菜单名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="orderNum">
              <el-input-number
                class="w100p"
                v-model="form.orderNum"
                controls-position="right"
                :min="0"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != 'F'">
            <el-form-item prop="isFrame">
              <template #label>
                <span>
                  <el-tooltip
                    content="选择是外链则路由地址需要以`http(s)://`开头"
                    placement="top"
                  >
                    <el-icon :size="14"><QuestionFilled /></el-icon>
                  </el-tooltip>
                  是否外链
                </span>
              </template>
              <el-radio-group v-model="form.isFrame">
                <el-radio label="0">是</el-radio>
                <el-radio label="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != 'F'">
            <el-form-item prop="path">
              <template #label>
                <span>
                  <el-tooltip
                    content="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头"
                    placement="top"
                  >
                    <el-icon :size="14"><QuestionFilled /></el-icon>
                  </el-tooltip>
                  路由地址
                </span>
              </template>
              <el-input v-model="form.path" placeholder="请输入路由地址" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType == 'C'">
            <el-form-item prop="component">
              <template #label>
                <span>
                  <el-tooltip
                    content="访问的组件路径，如：`system/user/index`，默认在`views`目录下"
                    placement="top"
                  >
                    <el-icon :size="14"><QuestionFilled /></el-icon>
                  </el-tooltip>
                  组件路径
                </span>
              </template>
              <el-input v-model="form.component" placeholder="请输入组件路径" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != 'M'">
            <el-form-item prop="perms">
              <el-input
                v-model="form.perms"
                placeholder="请输入权限标识"
                maxlength="100"
              />

              <template #label>
                <span>
                  <el-tooltip
                    content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasPermi('system:user:list')`)"
                    placement="top"
                  >
                    <el-icon :size="14"><QuestionFilled /></el-icon>
                  </el-tooltip>
                  权限字符
                </span>
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType == 'C'">
            <el-form-item prop="query">
              <el-input
                v-model="form.query"
                placeholder="请输入路由参数"
                maxlength="255"
              />
              <template #label>
                <span>
                  <el-tooltip
                    content='访问路由的默认传递参数，如：`{"id": 1, "name": "ry"}`'
                    placement="top"
                  >
                    <el-icon :size="14"><QuestionFilled /></el-icon>
                  </el-tooltip>
                  路由参数
                </span>
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType == 'C'">
            <el-form-item prop="isCache">
              <template #label>
                <span>
                  <el-tooltip
                    content="选择是则会被`keep-alive`缓存，需要匹配组件的`name`和地址保持一致"
                    placement="top"
                  >
                    <el-icon :size="14"><QuestionFilled /></el-icon>
                  </el-tooltip>
                  是否缓存
                </span>
              </template>
              <el-radio-group v-model="form.isCache">
                <el-radio label="0">缓存</el-radio>
                <el-radio label="1">不缓存</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != 'F'">
            <el-form-item prop="visible">
              <template #label>
                <span>
                  <el-tooltip
                    content="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问"
                    placement="top"
                  >
                    <el-icon :size="14"><QuestionFilled /></el-icon>
                  </el-tooltip>
                  显示状态
                </span>
              </template>
              <el-radio-group v-model="form.visible">
                <el-radio
                  v-for="dict in dicts.type.sys_show_hide"
                  :key="dict.value"
                  :label="dict.value"
                  >{{ dict.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != 'F'">
            <el-form-item prop="status">
              <template #label>
                <span>
                  <el-tooltip
                    content="选择停用则路由将不会出现在侧边栏，也不能被访问"
                    placement="top"
                  >
                    <el-icon :size="14"><QuestionFilled /></el-icon>
                  </el-tooltip>
                  菜单状态
                </span>
              </template>
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in dicts.type.sys_normal_disable"
                  :key="dict.value"
                  :label="dict.value"
                  >{{ dict.label }}</el-radio
                >
              </el-radio-group>
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
  DArrowRight,
  Sort,
  CircleClose
} from '@element-plus/icons-vue';
import useDictTypes from '@/hooks/web/useDictTypes';
import TablePanel from '@/components/TablePanel/index.vue';
import { useDebounceFn } from '@vueuse/shared';
import { ElMessageBox, ElMessage } from 'element-plus';
import SvgIcon from '@/components/SvgIcon/index.vue';
import { parseTime } from '@/utils';
import { handleTree } from '@/utils/menu';
import IconSelect from '@/components/IconSelect/index.vue';

import type {
  FormInstance,
  FormRules,
  CheckboxValueType,
  ElTree
} from 'element-plus';
import { vAuthority } from '@/directive/authority';

import {
  menuList,
  getMenu,
  addMenu,
  removeMenu,
  editMenu,
  exportMenu
} from '@/api/menu/index';
import type {
  MenuVo,
  MenuSearchBody,
  MenuAddAndEditBody,
  MenuType
} from '@/api/menu/types';

type ModelSearchBody = MenuSearchBody;
type ModelBody = MenuAddAndEditBody;
type ModelVo = MenuVo;

/**
 * 页面配置，抽离公共部分，少搬点砖
 */
const pageConfig = reactive({
  title: '菜单',
  id: 'menuId',
  api: {
    list: menuList,
    get: getMenu,
    add: addMenu,
    remove: removeMenu,
    edit: editMenu,
    export: exportMenu
  },
  authorites: {
    list: 'system:menu:list',
    get: 'system:menu:query',
    add: 'system:menu:add',
    edit: 'system:menu:edit',
    remove: 'system:menu:remove',
    export: 'system:menu:export'
  }
});

const rules = reactive<FormRules>({
  menuName: [{ required: true, message: '菜单名称不能为空', trigger: 'blur' }],
  orderNum: [{ required: true, message: '菜单顺序不能为空', trigger: 'blur' }],
  path: [{ required: true, message: '路由地址不能为空', trigger: 'blur' }]
});

const dicts = useDictTypes([
  'sys_show_hide',
  'sys_common_status',
  'sys_normal_disable'
]);
const searchForm = reactive<ModelSearchBody>({
  menuName: '',
  status: ''
});

const iconSelectRef = ref<InstanceType<typeof IconSelect>>();
const tableRef = ref<InstanceType<typeof TablePanel>>();
const searchFormRef = ref<FormInstance>();
const formLoading = ref<boolean>(false);
const formRef = ref<FormInstance>();
const menuOptions = ref<any[]>([]);
const iconPopoverVisible = ref<boolean>(false);
const isExpandAll = ref<boolean>(false);
const refreshTable = ref<boolean>(true);
const treeSelectProps = ref({
  label: 'menuName'
});
const dialogState = reactive({
  title: '',
  dialogVisible: false
});

let form = reactive<ModelBody>({
  menuId: undefined,
  parentId: 0,
  menuName: undefined,
  icon: '',
  menuType: 'M',
  orderNum: 1,
  isFrame: '1',
  isCache: '0',
  visible: '0',
  status: '0'
});

onMounted(() => {
  search();
});

const search = useDebounceFn(() => {
  tableRef.value && tableRef.value.search({ ...searchForm });
}, 200);

function tableFormatter(res: any) {
  const { data } = res;
  const resData = handleTree(data, 'menuId');
  return resData;
}

function fetchList(obj: ModelSearchBody) {
  return pageConfig.api.list({
    ...obj
  });
}

function searchReset() {
  searchFormRef.value?.resetFields();
}

function searchRefresh() {
  searchReset();
  search();
}

function cancel() {
  dialogState.dialogVisible = false;
  formReset();
}

function formReset() {
  formRef.value?.resetFields();
  Object.keys(form).forEach((key) => {
    form[key] = undefined;
  });
  form.parentId = 0;
  form.icon = '';
  form.menuType = 'M';
  form.orderNum = 1;
  form.isFrame = '1';
  form.isCache = '0';
  form.visible = '0';
  form.status = '0';
}

function submitForm() {
  formRef.value?.validate((valid) => {
    if (valid) {
      formLoading.value = true;

      const isAdd = form[pageConfig.id] === undefined;
      const api = isAdd ? pageConfig.api.add : pageConfig.api.edit;

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

function handleAdd(row?: any) {
  formReset();
  getTreeselect();
  dialogState.title = `添加${pageConfig.title}`;
  if (row && row.menuId) {
    form.parentId = row.menuId;
  }
  dialogState.dialogVisible = true;
}

function getTreeselect(): Promise<any> {
  return new Promise((resolve, reject) => {
    pageConfig.api.list().then((response) => {
      menuOptions.value = [];
      const menu = { menuId: 0, menuName: '主类目', children: [] as any[] };
      menu.children = handleTree(response.data, 'menuId');
      menuOptions.value.push(menu);
      resolve(menu);
    });
  });
}

function selected(name: string) {
  form.icon = ''
  iconPopoverVisible.value = false;
  setTimeout(() => {
    form.icon = name;
  }, 200);
}

function handleEdit(row: any) {
  formReset();
  getTreeselect().then(() => {
    dialogState.title = `修改${pageConfig.title}`;
    getDetail(row[pageConfig.id]).then((data) => {
      dialogState.dialogVisible = true;
      Object.keys(form).forEach((key) => {
        if (key in data) {
          form[key] = data[key];
        }
      });
    });
  });
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
  batchDelete(row[pageConfig.id], row.menuName).then(() => {
    search();
    ElMessage.success('删除成功');
  });
}

function batchDelete(ids: string, menuName?: string) {
  return new Promise((resolve, reject) => {
    ElMessageBox.confirm(`是否确认删除名称为“${menuName}”的数据项？`, '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
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

function toggleExpandAll() {
  refreshTable.value = false;
  isExpandAll.value = !isExpandAll.value;
  nextTick(() => {
    refreshTable.value = true;
    search();
  });
}

function handlePopverShow() {
  iconSelectRef.value?.reset();
}

function handleIconClear() {
  form.icon = ''
}
</script>

<style lang="scss" scoped></style>
