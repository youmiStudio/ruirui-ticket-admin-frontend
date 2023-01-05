<template>
  <div class="app-container">
    <el-card class="mb-10px" shadow="never">
      <el-form ref="searchFormRef" label-width="70px" :model="searchForm">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="系统模块" prop="title">
              <el-input
                v-model="searchForm.title"
                placeholder="请输入系统模块"
                clearable
                @clear="search"
                @change="search"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="操作人员" prop="operName">
              <el-input
                v-model="searchForm.operName"
                placeholder="请输入操作人员"
                clearable
                @clear="search"
                @change="search"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="类型" prop="businessType">
              <el-select
                class="w100%"
                v-model="searchForm.businessType"
                placeholder="操作类型"
                clearable
                @change="search"
              >
                <el-option label="全部" value=""></el-option>
                <el-option
                  v-for="dict in dicts.type.sys_oper_type"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select> </el-form-item
          ></el-col>
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
            <el-form-item label="操作时间">
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
              <el-button :icon="Refresh" @click="searchRefresh">重置</el-button>
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
        <el-table-column label="日志编号" align="center" prop="operId" />
        <el-table-column label="系统模块" align="center" prop="title" />
        <el-table-column label="操作类型" align="center" prop="businessType">
          <template #default="scope">
            <dict-tag
              :options="dicts.type.sys_oper_type"
              :value="scope.row.businessType"
            />
          </template>
        </el-table-column>
        <el-table-column label="请求方式" align="center" prop="requestMethod" />
        <el-table-column
          label="操作人员"
          align="center"
          prop="operName"
          width="115"
          :show-overflow-tooltip="true"
          sortable="custom"
          :sort-orders="['descending', 'ascending']"
        />
        <el-table-column
          label="操作地址"
          align="center"
          prop="operIp"
          width="130"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="操作地点"
          align="center"
          prop="operLocation"
          :show-overflow-tooltip="true"
        />
        <el-table-column label="操作状态" align="center" prop="status">
          <template #default="scope">
            <dict-tag
              :options="dicts.type.sys_login_status"
              :value="scope.row.status"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="操作日期"
          align="center"
          prop="operTime"
          sortable="custom"
          :sort-orders="['descending', 'ascending']"
          width="180"
        >
          <template #default="scope">
            <span>{{
              parseTime(scope.row.operTime, '{y}-{m}-{d} {h}:{i}')
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template #default="scope">
            <el-button
              size="small"
              :icon="View"
              type="primary"
              link
              @click.stop="handleView(scope.row)"
              v-authority="['monitor:operlog:query']"
              >详细</el-button
            >
          </template>
        </el-table-column>
      </TablePanel>
    </el-card>

    <!-- 操作日志详细 -->
    <el-dialog title="操作日志详细" v-model="open" width="700px" append-to-body>
      <el-form :model="form" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="操作模块："
              >{{ form.title }} / {{ typeFormat(form) }}</el-form-item
            >
            <el-form-item label="登录信息："
              >{{ form.operName }} / {{ form.operIp }} /
              {{ form.operLocation }}</el-form-item
            >
          </el-col>
          <el-col :span="12">
            <el-form-item label="请求地址：">{{ form.operUrl }}</el-form-item>
            <el-form-item label="请求方式：">{{
              form.requestMethod
            }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="操作方法：">{{ form.method }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="请求参数：">{{ form.operParam }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="返回参数：">{{
              form.jsonResult
            }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作状态：">
              <div v-if="form.status === 0">正常</div>
              <div v-else-if="form.status === 1">失败</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作时间：">{{
              parseTime(form.operTime, '{y}-{m}-{d} {h}:{i}')
            }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="异常信息：" v-if="form.status === 1">{{
              form.errorMsg
            }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer class="dialog-footer">
        <el-button @click="open = false">关 闭</el-button>
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
  View
} from '@element-plus/icons-vue';
import TablePanel from '@/components/TablePanel/index.vue';
import useDictTypes from '@/hooks/web/useDictTypes';
import { parseTime, selectDictLabel } from '@/utils';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useDebounceFn } from '@vueuse/shared';
import { vAuthority } from '@/directive/authority';
import {
  operlogList,
  cleanOperlog,
  removeOperlog,
  exportOperlog
} from '@/api/monitor/operlog';
import type { OperlogSearchBody, OperlogVo } from '@/api/monitor/operlog/types';

type ModelSearchBody = OperlogSearchBody;
type ModelVo = OperlogVo;

/**
 * 页面配置，抽离公共部分，少搬点砖
 */
const pageConfig = reactive({
  title: '操作日志',
  id: 'operId',
  isAsc: 'desc',
  orderByColumn: 'oper_id',
  api: {
    list: operlogList,
    remove: removeOperlog,
    clean: cleanOperlog,
    export: exportOperlog
  },
  authorites: {
    list: 'monitor:operlog:list',
    remove: 'monitor:operlog:remove',
    export: 'monitor:operlog:export'
  }
});

const dicts = useDictTypes(['sys_login_status', 'sys_oper_type']);
const tableRef = ref<InstanceType<typeof TablePanel>>();
const searchFormRef = ref<FormInstance>();
const batchDeleteDisable = ref<boolean>(true);
const tableRecordRows = ref<ModelVo[]>([]);

const searchForm = reactive<ModelSearchBody>({
  title: '',
  operName: '',
  businessType: '',
  status: ''
});

const form = ref<ModelVo>({} as ModelVo);
const open = ref<boolean>(false);
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
  dateRange.value = [];
}

function searchRefresh() {
  searchReset();
  search();
}

function handleView(row: ModelVo) {
  form.value = row;
  open.value = true;
}

function typeFormat(row: ModelVo) {
  return selectDictLabel(dicts.type.sys_oper_type, row.businessType);
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
</script>

<style lang="scss" scoped></style>
