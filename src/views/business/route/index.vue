<template>
  <div class="app-container">
    <el-card class="mb-10px" shadow="never">
      <el-form ref="searchFormRef" :model="searchForm">
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
            <el-form-item label="出行时间">
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

          <el-col v-if="!checkMode" :span="8">
            <el-form-item label="状态" prop="status">
              <el-select
                class="w100%"
                v-model="searchForm.status"
                placeholder="路线状态"
                @change="search"
              >
                <el-option label="全部" value=""></el-option>
                <el-option
                  v-for="dict in dicts.type.sys_route_status"
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

      <el-row :gutter="10">
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
              <el-tag type="warning"
                >{{ element.beginTime }}至{{ element.endTime }}</el-tag
              >
              <DictTag
                class="ml-5px"
                style="display: inline-block"
                :options="dicts.type.sys_route_status"
                :value="element.status"
              ></DictTag>

              <div class="name">{{ element.routeName }}</div>
              <div v-if="element.routeDescribe" class="describe">{{
                element.routeDescribe
              }}</div>
            </div>
          </div>
        </template>
      </table-card>
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
} from '@/api/business/route/index';
import { parseTime } from '@/utils';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useDebounceFn } from '@vueuse/shared';
import { vAuthority } from '@/directive/authority';

import type {
  RouteSearchBody,
  RouteBody,
  RouteVo
} from '~/api/business/route/types';
import router from '~/router';

const props = defineProps({
  checkMode: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['check']);

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

const dicts = useDictTypes('sys_route_status');
const tableRef = ref<InstanceType<typeof TablePanel>>();
const formRef = ref<FormInstance>();
const searchFormRef = ref<FormInstance>();
const formLoading = ref<boolean>(false);
const batchDeleteDisable = ref<boolean>(true);
const tableRecordRows = ref<ModelVo[]>([]);

const dateRange = ref<any>([]);

const dateParams = computed(() => {
  if (!dateRange.value) {
    return {};
  }
  return {
    beginTime: dateRange.value[0] || '',
    endTime: dateRange.value[1] || ''
  };
});

const searchForm = reactive<ModelSearchBody>({
  routeName: '',
  status: ''
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
  routeDescribe: [
    { required: true, message: '路线描述不能为空', trigger: 'blur' }
  ],
  status: [{ required: true, message: '状态必须选择', trigger: 'blur' }]
});

let form = reactive<ModelBody>({
  routeId: undefined,
  routeName: '',
  routeDescribe: '',
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
  const params = Object.assign(
    {},
    {
      ...searchForm,
      ...dateParams.value
    }
  );
  tableRef.value && tableRef.value.search<ModelVo>(params);
}, 200);

function switchBatchDelete(selectRowsLength: number) {
  if (selectRowsLength > 0) {
    batchDeleteDisable.value = false;
    return;
  }
  batchDeleteDisable.value = true;
}

function fetchList(obj: any) {
  return pageConfig.api.list({
    ...searchForm,
    ...dateParams.value,
    ...obj,
    orderByColumn: pageConfig.orderByColumn,
    isAsc: pageConfig.isAsc
  });
}

function handleAdd() {
  formReset();
  router.push(`/ticket/route/add`);
  // dialogState.title = `添加${pageConfig.title}`;
  // dialogState.dialogVisible = true;
}

function handleEdit(row: any) {
  router.push(`/ticket/route/detail/${row.routeId}`);
}

function handleBatchDelete() {
  const ids = tableRecordRows.value.map((row) => row[pageConfig.id]);
  batchDelete(ids.join(',')).then(() => {
    search();
    ElMessage.success('删除成功');
  });
}

function handleRowDelete(row: any) {
  batchDelete(row[pageConfig.id]).then(() => {
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

/* --------------------Extra Features Start-------------------- */

/* --------------------Extra Features End-------------------- */
</script>

<style lang="scss" scoped>
.car-info {
  padding: 3px 12px;
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
