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
            >新增</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button type="info" plain size="small" :icon="Sort"
            >展开/折叠</el-button
          >
        </el-col>
      </el-row>

      <TablePanel
        ref="tableRef"
        row-key="menuId"
        :url="fetchList"
        :primary-key="pageConfig.id"
        :has-pagination="false"
        :selectType="false"
        :formatter="tableFormatter"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
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
              >修改</el-button
            >
            <el-button
              v-authority="[pageConfig.authorites.add]"
              size="small"
              link
              type="primary"
              :icon="Plus"
              >新增</el-button
            >
            <el-button
              v-authority="[pageConfig.authorites.remove]"
              link
              size="small"
              type="danger"
              :key="row[pageConfig.id]"
              :icon="Delete"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </TablePanel>
    </el-card>
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
  Sort
} from '@element-plus/icons-vue';
import useDictTypes from '@/hooks/web/useDictTypes';
import TablePanel from '@/components/TablePanel/index.vue';
import { useDebounceFn } from '@vueuse/shared';
import { ElMessageBox, ElMessage } from 'element-plus';
import SvgIcon from '@/components/SvgIcon/index.vue';
import { parseTime } from '@/utils';
import { handleTree } from '@/utils/menu';

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
  MenuAddAndEditBody
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

const dicts = useDictTypes('sys_common_status');
const searchForm = reactive<ModelSearchBody>({
  menuName: '',
  status: ''
});
const tableRef = ref<InstanceType<typeof TablePanel>>();
const searchFormRef = ref<FormInstance>();

onMounted(() => {
  search();
});

const search = useDebounceFn(() => {
  tableRef.value && tableRef.value.search({ ...searchForm });
}, 200);

function tableFormatter(res: any) {
  const { data } = res;
  const resData = handleTree(data, 'menuId')
  console.log(resData);
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
</script>

<style lang="scss" scoped></style>
