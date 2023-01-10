<template>
  <div class="app-container">
    <el-card class="mb-10px" shadow="never">
      <el-form ref="searchFormRef" :model="searchForm">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="车辆名称" prop="carName">
              <el-input
                v-model="searchForm.carName"
                placeholder="请输入车辆名称"
                clearable
                maxlength="100"
                @clear="search"
                @change="search"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="车牌号码" prop="carNo">
              <el-input
                v-model="searchForm.carNo"
                placeholder="请输入车牌号码"
                clearable
                maxlength="10"
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
                placeholder="车辆状态"
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
          label="车辆编号"
          prop="carId"
          sortable="custom"
          align="center"
        >
        </el-table-column>
        <el-table-column label="车辆名称" prop="carName" align="center">
        </el-table-column>
        <el-table-column label="车牌号码" prop="carNo" align="center">
        </el-table-column>
        <el-table-column label="车辆描述" prop="carDescribe" align="center">
        </el-table-column>
        <template v-for="item in formSeatIconItems" :key="item.prop">
          <el-table-column
            class-name="table-image-icon"
            :label="item.label"
            align="center"
          >
            <template #default="{ row }">
              <el-image
                :src="apiUrl + row[item.prop]"
                :zoom-rate="1.2"
                :preview-src-list="[apiUrl + row[item.prop]]"
                :initial-index="1"
                :preview-teleported="true"
                :hide-on-click-modal="true"
                fit="cover"
                @click.stop
              />
            </template>
          </el-table-column>
        </template>
        <el-table-column label="状态" align="center">
          <template #default="{ row }">
            <DictTag
              :options="dicts.type.sys_common_status"
              :value="row.status"
            ></DictTag>
          </template>
        </el-table-column>
        <el-table-column
          label="备注"
          prop="remark"
          align="center"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column label="创建时间" width="150px" align="center">
          <template #default="{ row }">
            <span>{{
              row.createTime && parseTime(row.createTime, '{y}-{m}-{d} {h}:{i}')
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="fixed-width">
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
      width="500px"
      append-to-body
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="车辆名称" prop="carName">
              <el-input
                v-model="form.carName"
                placeholder="请输入车辆名称"
                maxlength="20"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="车牌号码" prop="carNo">
              <el-input
                v-model="form.carNo"
                placeholder="请输入车牌号码"
                maxlength="10"
              ></el-input>
            </el-form-item>
          </el-col>
          <template v-for="item in formSeatIconItems" :key="item.prop">
            <el-col :span="24">
              <el-form-item :label="item.label" :prop="item.prop">
                <el-upload
                  class="avatar-uploader"
                  :show-file-list="false"
                  :before-upload="beforeAvatarUpload"
                  :http-request="uploadHttpRequest"
                  :on-success="handleSeatIconUploadOnSuccess(item.prop)"
                >
                  <img
                    v-if="form[item.prop]"
                    :src="apiUrl + form[item.prop]"
                    class="avatar"
                  />
                  <el-icon v-else class="avatar-uploader-icon"
                    ><Plus
                  /></el-icon>
                </el-upload>
              </el-form-item>
            </el-col>
          </template>
          <el-col :span="24">
            <el-form-item label="车辆描述" prop="carDescribe">
              <el-input
                v-model="form.carDescribe"
                placeholder="车辆描述"
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
import {
  Search,
  Refresh,
  Plus,
  Edit,
  Delete,
  Download,
  RefreshRight
} from '@element-plus/icons-vue';
import TablePanel from '@/components/TablePanel/index.vue';
import useDictTypes from '@/hooks/web/useDictTypes';
import {
  carList,
  addCar,
  getCar,
  editCar,
  removeCar,
  exportCar
} from '@/api/business/car/index';
import { parseTime } from '@/utils';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useDebounceFn } from '@vueuse/shared';
import { vAuthority } from '@/directive/authority';
import type { UploadProps } from 'element-plus';
import type {
  CarAddAndEditBody,
  CarSearchBody,
  CarVo
} from '@/api/business/car/types';
import { useGlobSettings } from '@/hooks/settings/useGlobSettings';
import { isAmount, isImage } from '@/utils/is';
import { uploadFile } from '@/api/common/index';

type ModelSearchBody = CarSearchBody;
type ModelBody = CarAddAndEditBody;
type ModelVo = CarVo;

/**
 * 页面配置，抽离公共部分，少搬点砖
 */
const pageConfig = reactive({
  title: '车辆',
  id: 'carId',
  isAsc: 'asc',
  orderByColumn: 'car_id',
  api: {
    list: carList,
    get: getCar,
    add: addCar,
    remove: removeCar,
    edit: editCar,
    export: exportCar
  },
  authorites: {
    list: 'ticket:car:list',
    get: 'ticket:car:query',
    add: 'ticket:car:add',
    edit: 'ticket:car:edit',
    remove: 'ticket:car:remove',
    export: 'ticket:car:export'
  }
});
const dicts = useDictTypes(['sys_common_status']);
const tableRef = ref<InstanceType<typeof TablePanel>>();
const formRef = ref<FormInstance>();
const searchFormRef = ref<FormInstance>();
const formLoading = ref<boolean>(false);
const batchDeleteDisable = ref<boolean>(true);
const tableRecordRows = ref<ModelVo[]>([]);

const searchForm = reactive<ModelSearchBody>({
  carName: '',
  carNo: '',
  status: ''
});

const rules = reactive<FormRules>({
  carName: [{ required: true, message: '车辆名称不能为空', trigger: 'blur' }],
  carNo: [{ required: true, message: '车牌号码不能为空', trigger: 'blur' }],
  carSeatImage: [{ required: true, message: '座位图不能为空' }],
  status: [{ required: true, message: '状态必须选择', trigger: 'blur' }]
});

let form = reactive<ModelBody>({
  carId: undefined,
  carName: '',
  carDescribe: '',
  carNo: '',
  carSeatImage: '',
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
  form['status'] = '0';
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
type SeatIconItems = {
  label: string;
  prop: keyof Pick<ModelBody, 'carSeatImage'>;
};

const globSettings = useGlobSettings();
const apiUrl = globSettings.apiUrl;
const formSeatIconItems = ref<SeatIconItems[]>([
  {
    label: '座位图',
    prop: 'carSeatImage'
  }
]);

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (!isImage(rawFile.type)) {
    ElMessage.error('请上传图片!');
    return false;
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('图片不能大于2MB!');
    return false;
  }
  return true;
};

const uploadHttpRequest: UploadProps['httpRequest'] = (options) => {
  const { file } = options;
  let form = new FormData();
  form.append('file', file);
  return uploadFile(form);
};

const handleSeatIconUploadOnSuccess = (
  prop: string
): UploadProps['onSuccess'] => {
  return (res) => {
    const { data } = res;
    if (data) {
      form[prop] = data.fileName;
    }
  };
};
/* --------------------Extra Features End-------------------- */
</script>

<style lang="scss" scoped>
$--icon-width: 100%;
$--icon-height: 175px;
:deep() {
  .avatar-uploader,
  .el-upload {
    width: 100%;
  }
}
.el-icon.avatar-uploader-icon {
  width: $--icon-width;
  height: $--icon-height;
}
.avatar {
  width: $--icon-width;
  height: $--icon-height;
}
</style>
