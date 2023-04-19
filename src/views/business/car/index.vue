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

          <el-col v-if="!checkMode" :span="8">
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

      <el-row :gutter="10" v-if="!checkMode">
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
      </el-row>

      <table-card
        ref="tableRef"
        :url="fetchList"
        :authority="{
          edit: [pageConfig.authorites.edit],
          delete: [pageConfig.authorites.remove]
        }"
        :show-delete="!checkMode"
        :show-setting="!checkMode"
        @edit="handleEdit"
        @delete="handleRowDelete"
        @click="(item) => emit('check', item)"
      >
        <template #default="{ element }">
          <div>
            <el-image :src="element.mainImgUrl"></el-image>
            <div class="car-info">
              <el-tag class="mr-5px" type="warning">{{ element.carNo }}</el-tag>
              <DictTag
                style="display: inline-block"
                :options="dicts.type.sys_common_status"
                :value="element.status"
              ></DictTag>

              <div class="name">{{ element.carName }}</div>
              <div v-if="element.carDescribe" class="describe">{{
                element.carDescribe
              }}</div>
            </div>
          </div>
        </template>
      </table-card>
    </el-card>

    <el-dialog
      class="dialog-body-scroll"
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
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="车辆图片" prop="gallery">
              <upload-image
                multiple
                v-model="form.gallery"
                idKey="carGalleryId"
              ></upload-image>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="车牌号码" prop="carNo">
              <el-input
                v-model="form.carNo"
                placeholder="请输入车牌号码"
                maxlength="10"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="座位方案" prop="seatSchemeId">
              <div>
                <div v-if="form.seatSchemeId">
                  <el-image :src="currentSeatScheme?.carPlaneImage"></el-image>
                  <span>方案名称:{{ currentSeatScheme?.seatSchemeName }}</span>
                </div>
                <el-button type="primary" @click="openSeatScheme"
                  >选择方案</el-button
                >
              </div>
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
            <el-form-item label="车辆描述" prop="carDescribe">
              <el-input
                show-word-limit
                v-model="form.carDescribe"
                placeholder="车辆描述"
                type="textarea"
                :row="3"
                maxlength="100"
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
      class="dialog-body-p0"
      v-model="seatSchemeDialogVisible"
      title="选择座位方案"
      width="60%"
      append-to-body
    >
      <seat-scheme-page
        check-mode
        @check="seatSchemeCheckHandler"
      ></seat-scheme-page>
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
  RefreshRight,
  Setting
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
import { SeatSchemeDTO } from '~/api/business/seatScheme/types';
import SeatSchemePage from '@/views/business/seat-scheme/index.vue';

const props = defineProps({
  checkMode: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['check']);

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
  status: props.checkMode ? '0' : ''
});

const rules = reactive<FormRules>({
  carName: [{ required: true, message: '车辆名称不能为空', trigger: 'blur' }],
  carNo: [{ required: true, message: '车牌号码不能为空', trigger: 'blur' }],
  gallery: [{ required: true, message: '座位图不能为空' }],
  status: [{ required: true, message: '状态必须选择', trigger: 'blur' }],
  seatSchemeId: [
    { required: true, message: '座位方案不能为空', trigger: 'blur' }
  ]
});

let currentSeatScheme = ref<SeatSchemeDTO>();

let form = reactive<ModelBody>({
  carId: undefined,
  carName: '',
  carDescribe: '',
  gallery: [],
  seatSchemeId: 0,
  carNo: '',
  status: '0',
  remark: ''
});

const dialogState = reactive({
  title: '',
  dialogVisible: false
});

const seatSchemeDialogVisible = ref<boolean>();

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

function fetchList(obj: any) {
  return pageConfig.api.list({
    ...obj,
    ...searchForm,
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
    currentSeatScheme.value = data.seatScheme;
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
  form['gallery'] = [];
  form['status'] = '0';
  currentSeatScheme.value = undefined;
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
      if (!form.gallery) return;
      form.mainImgUrl = form.gallery[0].original;
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

function openSeatScheme() {
  seatSchemeDialogVisible.value = true;
}

function seatSchemeCheckHandler(row: SeatSchemeDTO) {
  currentSeatScheme.value = row;
  form.seatSchemeId = row.seatSchemeId;
  seatSchemeDialogVisible.value = false;
}
/* --------------------Extra Features End-------------------- */
</script>

<style lang="scss" scoped>
$--icon-width: 100%;
$--icon-height: 175px;
:deep() {
  .image-uploader,
  .el-upload {
    width: 100%;
  }
}
.el-icon.image-uploader-icon {
  width: $--icon-width;
  height: $--icon-height;
}
.avatar {
  width: $--icon-width;
  height: $--icon-height;
}

.car-info {
  padding: 0 10px;
  .name {
    margin-top: 5px;
    font-size: 22px;
    font-weight: 500;
  }
  .carNo {
    margin-top: 5px;
    font-size: 16px;
  }
  .describe {
    margin-top: 10px;
    font-size: 14px;
  }
}
</style>
