<template>
  <div class="app-container">
    <el-card class="mb-10px" shadow="never">
      <el-form ref="searchFormRef" :model="searchForm">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="站点名称" prop="siteName">
              <el-input
                v-model="searchForm.siteName"
                placeholder="请输入站点名称"
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
                placeholder="站点状态"
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
          <el-button type="primary" plain :icon="Plus" @click="handleAdd"
            >新增</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            :icon="Delete"
            :disabled="batchDeleteDisable"
            @click="handleBatchDelete"
            >删除</el-button
          >
        </el-col>
      </el-row>

      <TablePanel
        ref="tableRef"
        :url="fetchList"
        @select-change="handleTableSelectChange"
      >
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
        <el-table-column label="操作" align="center" class-name="fixed-width">
          <template #default>
            <el-button size="small" link type="primary" :icon="Edit"
              >修改</el-button
            >
            <el-button size="small" link type="danger" :icon="Delete"
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
            <el-form-item label="站点名称" prop="siteName">
              <el-input
                v-model="form.siteName"
                placeholder="请输入站点名称"
                maxlength="20"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="站点描述" prop="siteDescribe">
              <el-input
                v-model="form.siteDescribe"
                placeholder="请输入站点描述"
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
  </div>
</template>

<script lang="ts" setup>
import { Search, Refresh, Plus, Edit, Delete } from '@element-plus/icons-vue';
import TablePanel from '@/components/TablePanel/index.vue';
import useDictTypes from '@/hooks/web/useDictTypes';
import { siteList, addSite, removeSite } from '@/api/site/index';
import { parseTime } from '@/utils';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useDebounceFn } from '@vueuse/shared';

const dicts = useDictTypes('sys_common_status');
const tableRef = ref<InstanceType<typeof TablePanel>>();
const formRef = ref<FormInstance>();
const searchFormRef = ref<FormInstance>();
const formLoading = ref<boolean>(false);
const batchDeleteDisable = ref<boolean>(true);
const tableRecordRows = ref<any[]>([]);

const searchForm = reactive({
  siteName: '',
  status: ''
});

const rules = reactive<FormRules>({
  siteName: [
    { required: true, message: '站点名称不能为空', trigger: 'blur' },
    {
      min: 2,
      max: 20,
      message: '站点名称长度必须介于 2 和 20 之间',
      trigger: 'blur'
    }
  ],
  siteDescribe: [
    { required: true, message: '站点描述不能为空', trigger: 'blur' }
  ],
  status: [{ required: true, message: '状态必须选择', trigger: 'blur' }]
});

let form = reactive({
  siteId: null,
  siteName: '',
  siteDescribe: '',
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

function fetchList(obj: any) {
  return siteList({ ...obj, orderByColumn: 'siteId', isAsc: 'desc' });
}

function handleAdd() {
  dialogState.title = '添加站点';
  dialogState.dialogVisible = true;
}

function handleBatchDelete() {
  const siteIds = tableRecordRows.value.map((row) => row.siteId);
  ElMessageBox.confirm(
    `确定要删除站点编号[${siteIds.join(',')}]的数据项吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(() => {
      removeSite(siteIds.join(',')).then((res) => {
        const { code } = res;
        if (code === 200) {
          search();
          clearTableRecordRows();
          ElMessage.success('删除成功');
        }
      });
    })
    .catch(() => {
      ElMessage.info('取消删除');
    });
}

function clearTableRecordRows() {
  if(!tableRef.value) return
  tableRef.value.clearRecord()
}

function reset() {
  formRef.value?.resetFields();
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
      addSite(form).then((res) => {
        const { code } = res;
        if (code !== 200) {
          formLoading.value = false;
          return;
        }
        search();
        reset();
        dialogState.dialogVisible = false;
        formLoading.value = false;
      });
    }
  });
}

function cancel() {
  dialogState.dialogVisible = false;
  reset();
}
</script>

<style lang="scss" scoped></style>
