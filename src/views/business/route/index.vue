<template>
  <div class="app-container">
    <el-card class="mb-10px" shadow="never">
      <el-form ref="searchFormRef" label-width="75px" :model="searchForm">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="路线名称" prop="routeName">
              <el-input
                v-model="searchForm.routeName"
                placeholder="请输入路线名称"
                clearable
                maxlength="20"
                @clear="search"
                @change="search"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="起始站" prop="fromSiteId">
              <el-select
                class="w100%"
                v-model="searchForm.fromSiteId"
                placeholder="起始站"
                @change="search"
              >
                <el-option label="全部" value=""></el-option>
                <el-option
                  v-for="dict in sites"
                  :label="dict.siteName"
                  :value="dict.siteId"
                  :key="dict.siteId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="目的站" prop="toSiteId">
              <el-select
                class="w100%"
                v-model="searchForm.toSiteId"
                placeholder="目的站"
                @change="search"
              >
                <el-option label="全部" value=""></el-option>
                <el-option
                  v-for="dict in sites"
                  :label="dict.siteName"
                  :value="dict.siteId"
                  :key="dict.siteId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="状态" prop="status">
              <el-select
                class="w100%"
                v-model="searchForm.status"
                placeholder="路线状态"
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
          <el-col :span="6">
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
          label="路线编号"
          prop="routeId"
          sortable="custom"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="路线名称"
          prop="routeName"
          align="center"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          label="路线描述"
          prop="routeDescribe"
          align="center"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column label="起始站" align="center">
          <template #default="{ row }">
            <el-button
              link
              type="primary"
              @click.stop="openSiteDetailDialog(row.fromSite)"
              >{{ row.fromSite.siteName }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column label="目的站" align="center">
          <template #default="{ row }">
            <el-button
              link
              type="primary"
              @click.stop="openSiteDetailDialog(row.toSite)"
              >{{ row.toSite.siteName }}</el-button
            >
          </template>
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
        <el-table-column min-width="120px" label="操作" align="center" class-name="fixed-width">
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
      width="450px"
      append-to-body
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="路线名称" prop="routeName">
              <el-input
                v-model="form.routeName"
                placeholder="请输入路线名称"
                maxlength="20"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="起始站" prop="fromSiteId">
              <el-select
                class="w100%"
                v-model="form.fromSiteId"
                placeholder="请选择起始站"
              >
                <el-option
                  v-for="dict in sites"
                  :label="dict.siteName"
                  :value="dict.siteId"
                  :key="dict.siteId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="目的站" prop="toSiteId">
              <el-select
                class="w100%"
                v-model="form.toSiteId"
                placeholder="请选择目的站"
              >
                <el-option
                  v-for="dict in sites"
                  :label="dict.siteName"
                  :value="dict.siteId"
                  :key="dict.siteId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="路线描述" prop="routeDescribe">
              <el-input
                v-model="form.routeDescribe"
                placeholder="请输入路线描述"
                type="textarea"
                :row="3"
              ></el-input>
            </el-form-item>
          </el-col>
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

    <el-dialog
      v-model="detailDialogVisible"
      title="站点详情"
      width="350px"
      append-to-body
    >
      <el-form label-suffix=":">
        <el-row>
          <el-col :span="24">
            <el-form-item label="站点名称">{{
              siteDetail?.siteName
            }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="站点拼音名称">{{
              siteDetail?.sitePinyin
            }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="站点描述">{{
              siteDetail?.siteDescribe
            }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="站点备注">{{
              siteDetail?.remark
            }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="detailDialogVisible = false">
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
  Download
} from '@element-plus/icons-vue';
import TablePanel from '@/components/TablePanel/index.vue';
import useDictTypes from '@/hooks/web/useDictTypes';
import {
  routeList,
  getRoute,
  addRoute,
  removeRoute,
  editRoute,
  exportRoute
} from '@/api/route/index';
import { parseTime } from '@/utils';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useDebounceFn } from '@vueuse/shared';
import { vAuthority } from '@/directive/authority';

import type { SiteVo } from '~/api/site/types';
import type { RouteSearchBody, RouteBody, RouteVo } from '~/api/route/types';

import { wxSiteList } from '@/api/site/index';

type ModelSearchBody = RouteSearchBody;
type ModelBody = RouteBody;
type ModelVo = RouteVo;

/**
 * 页面配置，抽离公共部分，少搬点砖
 */
const pageConfig = reactive({
  title: '路线',
  id: 'routeId',
  isAsc: 'desc',
  orderByColumn: 'route_id',
  api: {
    list: routeList,
    get: getRoute,
    add: addRoute,
    remove: removeRoute,
    edit: editRoute,
    export: exportRoute
  },
  authorites: {
    list: 'ticket:route:list',
    get: 'ticket:route:query',
    add: 'ticket:route:add',
    edit: 'ticket:route:edit',
    remove: 'ticket:route:remove',
    export: 'ticket:route:export'
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
  routeName: '',
  status: '',
  fromSiteId: '',
  toSiteId: ''
});

const rules = reactive<FormRules>({
  routeName: [
    { required: true, message: '路线名称不能为空', trigger: 'blur' },
    {
      min: 2,
      max: 20,
      message: '路线名称长度必须介于 2 和 20 之间',
      trigger: 'blur'
    }
  ],
  fromSiteId: [
    { required: true, message: '起始站点不能为空', trigger: 'blur' }
  ],
  toSiteId: [{ required: true, message: '目的站点不能为空', trigger: 'blur' }],
  routeDescribe: [
    { required: true, message: '路线描述不能为空', trigger: 'blur' }
  ],
  status: [{ required: true, message: '状态必须选择', trigger: 'blur' }]
});

let form = reactive<ModelBody>({
  routeId: undefined,
  routeName: '',
  routeDescribe: '',
  fromSiteId: -1,
  toSiteId: -1,
  status: '0',
  remark: ''
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
  tableRef.value && tableRef.value.search<ModelVo>({ ...searchForm });
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

function handleAdd() {
  formReset();
  dialogState.title = `添加${pageConfig.title}`;
  dialogState.dialogVisible = true;
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

/* --------------------Extra Features Start-------------------- */
const sites = ref<SiteVo[]>();
const siteDetail = ref<SiteVo>();

const detailDialogVisible = ref<boolean>(false);

onMounted(() => {
  getSites();
});
/**
 * 获取所有站点
 */
function getSites() {
  wxSiteList().then((res) => {
    const { data } = res;
    if (data) {
      sites.value = data;
    }
  });
}

function openSiteDetailDialog(site: SiteVo) {
  detailDialogVisible.value = true;
  siteDetail.value = site;
}
/* --------------------Extra Features End-------------------- */
</script>

<style lang="scss" scoped></style>
