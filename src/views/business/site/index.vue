<template>
  <div class="app-container">
    <el-card class="mb-10px" shadow="never">
      <el-form :model="searchform">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="站点名称">
              <el-input
                v-model="searchform.siteName"
                placeholder="请输入站点名称"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="状态">
              <el-select
                class="w100%"
                v-model="searchform.status"
                placeholder="站点状态"
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
              <el-button :icon="Refresh">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" plain :icon="Plus">新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="danger" plain :icon="Delete">删除</el-button>
        </el-col>
      </el-row>

      <TablePanel ref="tableRef" :url="fetchList">
        <el-table-column
          label="站点编号"
          prop="siteId"
          sortable="custom"
          align="center"
        >
        </el-table-column>
        <el-table-column label="站点名称" prop="siteName" align="center">
        </el-table-column>
        <el-table-column label="站点描述" prop="siteDescribe" align="center">
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
        <el-table-column label="备注" prop="remark" align="center">
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          class-name="fixed-width"
        >
          <template #default>
            <el-button size="small" link type="primary" :icon="Edit">修改</el-button>
            <el-button size="small" link type="danger" :icon="Delete">删除</el-button>
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
  Upload,
  Download
} from '@element-plus/icons-vue';
import TablePanel from '@/components/TablePanel/index.vue';
import useDictTypes from '@/hooks/web/useDictTypes';
import { siteList } from '@/api/site/index';
import { parseTime } from '@/utils';

const dicts = useDictTypes('sys_common_status');

const searchform = reactive({
  siteName: '',
  status: ''
});

const tableRef = ref<InstanceType<typeof TablePanel>>();

onMounted(() => {
  search();
});

function fetchList(obj: any) {
  return siteList({ ...obj, orderByColumn: 'siteId', isAsc: 'desc' });
}

function search() {
  tableRef.value && tableRef.value.search({ ...searchform });
}
</script>

<style lang="scss" scoped></style>
