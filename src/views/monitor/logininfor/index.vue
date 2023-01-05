<template>
  <div>
    <div class="app-container">
      <el-card class="mb-10px" shadow="never">
        <el-form ref="searchFormRef" label-width="70px" :model="searchForm">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="登录地址" prop="ipaddr">
                <el-input
                  v-model="searchForm.ipaddr"
                  placeholder="请输入登录地址"
                  clearable
                  @clear="search"
                  @change="search"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="用户名称" prop="userName">
                <el-input
                  v-model="searchForm.userName"
                  placeholder="请输入用户名称"
                  clearable
                  @clear="search"
                  @change="search"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="状态" prop="status">
                <el-select
                  class="w100%"
                  v-model="searchForm.status"
                  placeholder="操作状态"
                  clearable
                  @change="search"
                >
                  <el-option label="全部" value=""></el-option>
                  <el-option
                    v-for="dict in dicts.type.sys_login_status"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select> </el-form-item
            ></el-col>
            <el-col :span="8">
              <el-form-item label="登录时间">
                <el-date-picker
                  class="w100%"
                  v-model="dateRange"
                  value-format="YYYY-MM-DD"
                  type="daterange"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="search"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label-width="0">
                <el-button type="primary" :icon="Search" @click="search"
                  >查询</el-button
                >
                <el-button :icon="Refresh" @click="searchRefresh"
                  >重置</el-button
                >
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <el-row :gutter="10" class="mb8">
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
              v-authority="[pageConfig.authorites.remove]"
              type="danger"
              plain
              size="small"
              :icon="Delete"
              @click="handlecCleanOperlog"
              >清空</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-authority="[pageConfig.authorites.unlock]"
              type="primary"
              plain
              size="small"
              :icon="Unlock"
              :disabled="tableRecordRows.length !== 1"
              @click="handleUnlock"
              >解锁</el-button
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
          <el-table-column label="访问编号" align="center" prop="infoId" />
          <el-table-column
            label="用户名称"
            align="center"
            prop="userName"
            :show-overflow-tooltip="true"
            sortable="custom"
            :sort-orders="['descending', 'ascending']"
          />
          <el-table-column
            label="登录地址"
            align="center"
            prop="ipaddr"
            width="130"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="登录地点"
            align="center"
            prop="loginLocation"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="浏览器"
            align="center"
            prop="browser"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="操作系统" align="center" prop="os" />
          <el-table-column label="登录状态" align="center" prop="status">
            <template #default="scope">
              <dict-tag
                :options="dicts.type.sys_login_status"
                :value="scope.row.status"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作信息" align="center" prop="msg" />
          <el-table-column
            label="登录时间"
            align="center"
            prop="operTime"
            sortable="custom"
            :sort-orders="['descending', 'ascending']"
            width="180"
          >
            <template #default="scope">
              <span>{{
                parseTime(scope.row.loginTime, '{y}-{m}-{d} {h}:{i}')
              }}</span>
            </template>
          </el-table-column>
        </TablePanel>
      </el-card>
    </div>
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
  View,
  Unlock
} from '@element-plus/icons-vue';
import TablePanel from '@/components/TablePanel/index.vue';
import useDictTypes from '@/hooks/web/useDictTypes';
import { parseTime, selectDictLabel } from '@/utils';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useDebounceFn } from '@vueuse/shared';
import { vAuthority } from '@/directive/authority';
import {
  logininforList,
  cleanLogininfo,
  removeLogininfo,
  exportLogininfo,
  unlockLogininfor
} from '@/api/monitor/logininfor';
import type {
  LoginInforSearchBody,
  LoginInforVo
} from '@/api/monitor/logininfor/types';

type ModelSearchBody = LoginInforSearchBody;
type ModelVo = LoginInforVo;

/**
 * 页面配置，抽离公共部分，少搬点砖
 */
const pageConfig = reactive({
  title: '访问日志',
  id: 'infoId',
  isAsc: 'desc',
  orderByColumn: 'info_id',
  api: {
    list: logininforList,
    remove: removeLogininfo,
    clean: cleanLogininfo,
    export: exportLogininfo,
    unlock: unlockLogininfor
  },
  authorites: {
    list: 'monitor:logininfor:list',
    remove: 'monitor:logininfor:remove',
    export: 'monitor:logininfor:export',
    unlock: 'monitor:logininfor:unlock'
  }
});

const dicts = useDictTypes(['sys_login_status']);
const tableRef = ref<InstanceType<typeof TablePanel>>();
const searchFormRef = ref<FormInstance>();
const batchDeleteDisable = ref<boolean>(true);
const tableRecordRows = ref<ModelVo[]>([]);

const searchForm = reactive<ModelSearchBody>({});
const dateRange = ref<any>([]);

const dateParams = computed(() => {
  if (!dateRange.value) {
    return {};
  }
  return {
    beginTime: dateRange.value[0],
    endTime: dateRange.value[1]
  };
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
  tableRef.value &&
    tableRef.value.search<ModelVo>({ ...searchForm, params: dateParams.value });
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

function fetchList(obj: ModelSearchBody) {
  return pageConfig.api.list({
    ...obj,
    orderByColumn: pageConfig.orderByColumn,
    isAsc: pageConfig.isAsc
  });
}

function handleExport() {
  pageConfig.api
    .export({ ...searchForm, params: dateParams.value })
    .then(() => {
      search();
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

function searchReset() {
  searchFormRef.value?.resetFields();
}

function searchRefresh() {
  searchReset();
  search();
}

function handlecCleanOperlog() {
  ElMessageBox.confirm(`是否确认清空所有操作日志数据项？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      pageConfig.api.clean().then((res) => {
        if (res.code === 200) {
          ElMessage.success('清空所有操作日志成功');
          search();
        }
      });
    })
    .catch(() => {});
}

function handleUnlock() {
  const username = tableRecordRows.value[0].userName;
  ElMessageBox.confirm(`是否确认解锁用户"${username}"数据项?`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      pageConfig.api.unlock(username).then((res) => {
        if (res.code === 200) {
          ElMessage.success(`用户${username}解锁成功`);
          search();
        }
      });
    })
    .catch(() => {});
}
</script>

<style lang="scss" scoped></style>
