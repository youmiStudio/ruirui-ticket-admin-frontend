<template>
  <div class="app-container">
    <el-card class="mb-10px" shadow="never">
      <el-form ref="searchFormRef"  :model="searchForm">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="座位名称" prop="seatName">
              <el-input
                v-model="searchForm.seatName"
                placeholder="请输入座位名称"
                clearable
                maxlength="20"
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
                placeholder="座位状态"
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
            <el-form-item label="价格区间" prop="seatName">
              <el-row :gutter="20">
                <el-col :span="11">
                  <el-input
                    v-model="searchForm.minPrice"
                    placeholder="最少价格"
                    clearable
                    maxlength="20"
                    @clear="search"
                  ></el-input>
                </el-col>
                <el-col :span="1"> - </el-col>
                <el-col :span="11">
                  <el-input
                    v-model="searchForm.maxPrice"
                    placeholder="最多价格"
                    clearable
                    maxlength="20"
                    @clear="search"
                  ></el-input>
                </el-col>
              </el-row>
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
          width="105px"
          label="座位编号"
          prop="seatId"
          sortable="custom"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="座位名称"
          prop="seatName"
          align="center"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          label="座位描述"
          prop="seatDescribe"
          align="center"
          :show-overflow-tooltip="true"
        >
        </el-table-column>

        <el-table-column width="105px" label="座位价格(元)" align="center">
          <template #default="{ row }">
            {{ row.price && fenToYuan(row.price) }}
          </template>
        </el-table-column>

        <el-table-column width="125px" label="原座位价格(元)" align="center">
          <template #default="{ row }">
            {{ row.oldPrice && fenToYuan(row.oldPrice) }}
          </template>
        </el-table-column>

        <template v-for="item in formSeatIconItems" :key="item.prop">
          <el-table-column
            class-name="seat-icon"
            :label="item.label"
            align="center"
          >
            <template #default="{ row }">
              <img :src="apiUrl + row[item.prop]" class="avatar" />
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
        <el-table-column width="175px" label="操作" align="center" class-name="fixed-width">
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
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="座位名称" prop="seatName">
              <el-input
                v-model="form.seatName"
                placeholder="请输入座位名称"
                maxlength="20"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="座位价格" prop="price">
              <el-input
                maxLength="10"
                v-model="form.price"
                placeholder="请输入座位价格"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="原座位价格" prop="oldPrice">
              <el-input
                maxLength="10"
                v-model="form.oldPrice"
                placeholder="请输入原座位价格"
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
            <el-form-item label="座位描述" prop="seatDescribe">
              <el-input
                v-model="form.seatDescribe"
                placeholder="请输入座位描述"
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
  Download
} from '@element-plus/icons-vue';
import TablePanel from '@/components/TablePanel/index.vue';
import useDictTypes from '@/hooks/web/useDictTypes';
import {
  seatList,
  getSeat,
  addSeat,
  removeSeat,
  editSeat,
  exportSeat
} from '@/api/business/seat/index';
import { uploadFile } from '@/api/common/index';
import { isAmount, isImage } from '@/utils/is';
import { yuanToFen, fenToYuan } from '@/utils/price';
import { parseTime } from '@/utils';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useDebounceFn } from '@vueuse/shared';
import { vAuthority } from '@/directive/authority';

import type { UploadProps } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import type { InternalRuleItem } from 'async-validator/dist-types/interface';
import type { SeatBody, SeatSearchBody, SeatVo } from '~/api/business/seat/types';
import { useGlobSettings } from '~/hooks/settings/useGlobSettings';

type ModelSearchBody = SeatSearchBody;
type ModelBody = SeatBody;
type ModelVo = SeatVo;

/**
 * 页面配置，抽离公共部分，少搬点砖
 */
const pageConfig = reactive({
  title: '座位',
  id: 'seatId',
  isAsc: 'desc',
  orderByColumn: 'seat_id',
  api: {
    list: seatList,
    get: getSeat,
    add: addSeat,
    remove: removeSeat,
    edit: editSeat,
    export: exportSeat
  },
  authorites: {
    list: 'ticket:seat:list',
    get: 'ticket:seat:query',
    add: 'ticket:seat:add',
    edit: 'ticket:seat:edit',
    remove: 'ticket:seat:remove',
    export: 'ticket:seat:export'
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
  seatName: '',
  status: '',
  minPrice: '',
  maxPrice: ''
});

const validatePrice = (
  rule: InternalRuleItem,
  value: string,
  callback: Function
) => {
  if (rule.required && !value) {
    return callback(new Error('请输入金额'));
  }
  if (value && !isAmount(value)) {
    return callback(new Error('请输入正确的金额, 最多保留2位小数'));
  }
  callback();
};

const rules = reactive<FormRules>({
  seatName: [
    { required: true, message: '座位名称不能为空', trigger: 'blur' },
    {
      min: 2,
      max: 20,
      message: '座位名称长度必须介于 2 和 20 之间',
      trigger: 'blur'
    }
  ],
  price: [{ required: true, validator: validatePrice }],
  oldPrice: [{ required: false, validator: validatePrice }],
  unSelectedIcon: [{ required: true, message: '未选座时图标不能为空' }],
  selectedIcon: [{ required: true, message: '已选座时图标不能为空' }],
  boughtIcon: [{ required: true, message: '已购座时图标不能为空' }],
  seatDescribe: [
    { required: true, message: '座位描述不能为空', trigger: 'blur' }
  ],
  status: [{ required: true, message: '状态必须选择', trigger: 'blur' }]
});

let form = reactive<ModelBody>({
  seatId: undefined,
  seatName: '',
  seatDescribe: '',
  price: '',
  oldPrice: '0',
  unSelectedIcon: '',
  selectedIcon: '',
  boughtIcon: '',
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
  const { minPrice, maxPrice } = searchForm;

  if (minPrice && !isAmount(minPrice)) {
    return ElMessage.error('请输入正确的金额, 最多保留2位小数');
  }

  if (maxPrice && !isAmount(maxPrice)) {
    return ElMessage.error('请输入正确的金额, 最多保留2位小数');
  }

  if (minPrice && maxPrice) {
    if (Number(minPrice) > Number(maxPrice)) {
      searchForm.minPrice = maxPrice;
    } else {
      searchForm.maxPrice = minPrice;
    }
  }

  tableRef.value &&
    tableRef.value.search<ModelVo>({
      ...searchForm,
      minPrice: minPrice && yuanToFen(minPrice),
      maxPrice: maxPrice && yuanToFen(maxPrice)
    });
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
    form.price = fenToYuan(form.price);
    form.oldPrice = fenToYuan(form.oldPrice);
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
  Object.keys(searchForm).forEach((key) => {
    searchForm[key] = '';
  });
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

      form.price = yuanToFen(form.price);
      form.oldPrice = yuanToFen(form.oldPrice);

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
  prop: keyof Pick<ModelBody, 'unSelectedIcon' | 'selectedIcon' | 'boughtIcon'>;
};

const globSettings = useGlobSettings();
const apiUrl = globSettings.apiUrl;
const formSeatIconItems = ref<SeatIconItems[]>([
  {
    label: '未选座位',
    prop: 'unSelectedIcon'
  },
  {
    label: '已选座位',
    prop: 'selectedIcon'
  },
  {
    label: '已购座位',
    prop: 'boughtIcon'
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
$--el-border-color: #dcdfe6;
$--el-transition-duration-fast: 0.2s;
$--el-color-primary: #409eff;
::v-deep {
  .seat-icon {
    .cell {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .el-form-item__label {
    font-weight: 700;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed $--el-border-color;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: $--el-transition-duration-fast;
  }

  .avatar-uploader .el-upload:hover {
    border-color: $--el-color-primary;
  }

  .el-icon.avatar-uploader-icon {
    font-size: 14px;
    color: #8c939d;
    width: 50px;
    height: 50px;
    text-align: center;
  }
  .avatar {
    width: 50px;
    height: 50px;
  }
}
</style>
