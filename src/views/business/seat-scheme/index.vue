<template>
  <div class="app-container">
    <el-card class="mb-10px" shadow="never">
      <el-form ref="searchFormRef" :model="searchForm">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="座位方案名称" prop="carName">
              <el-input
                v-model="searchForm.seatSchemeName"
                placeholder="请输入座位方案"
                clearable
                maxlength="100"
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
                placeholder="座位方案状态"
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

      <el-row v-if="!checkMode" :gutter="10">
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
        @click="
          (item) => {
            emit('check', item);
          }
        "
        @edit="handleEdit"
        @delete="handleRowDelete"
      >
        <template #default="{ element, index }">
          <div class="table-view">
            <el-image :src="element.carPlaneImage"></el-image>
            <span class="name">方案名称：{{ element.seatSchemeName }}</span>
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
  Download,
  RefreshRight,
  Setting
} from '@element-plus/icons-vue';
import TablePanel from '@/components/TablePanel/index.vue';
import TabelCard from '@/components/TableCard/index.vue';
import useDictTypes from '@/hooks/web/useDictTypes';
import { parseTime } from '@/utils';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useDebounceFn } from '@vueuse/shared';
import { vAuthority } from '@/directive/authority';
import {
  seatSchemeList,
  removeSeatScheme
} from '@/api/business/seatScheme/index';
import { SeatSchemeVO } from '~/api/business/seatScheme/types';

type ModelSearchBody = any;
type ModelBody = any;
type ModelVo = any;

const props = defineProps({
  checkMode: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['check']);

/**
 * 页面配置，抽离公共部分，少搬点砖
 */
const pageConfig = reactive({
  title: '座位方案',
  id: 'seatSchemeId',
  isAsc: 'desc',
  orderByColumn: 'seat_scheme_id',
  api: {
    list: seatSchemeList,
    remove: removeSeatScheme
  },
  authorites: {
    list: 'ticket:seatScheme:list',
    get: 'ticket:seatScheme:query',
    add: 'ticket:seatScheme:add',
    edit: 'ticket:seatScheme:edit',
    remove: 'ticket:seatScheme:remove',
    export: 'ticket:seatScheme:export'
  }
});

const dicts = useDictTypes(['sys_common_status']);
const tableRef = ref<InstanceType<typeof TabelCard>>();
const formRef = ref<FormInstance>();
const searchFormRef = ref<FormInstance>();
const formLoading = ref<boolean>(false);
const batchDeleteDisable = ref<boolean>(true);
const tableRecordRows = ref<ModelVo[]>([]);

const searchForm = reactive<ModelSearchBody>({
  seatSchemeName: '',
  carNo: '',
  status: ''
});

const router = useRouter();

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
  tableRef.value && tableRef.value.search();
}, 200);

const handleAdd = () => {
  router.push('/ticket/seat-scheme/add');
};

const handleEdit = (row: SeatSchemeVO) => {
  router.push(`/ticket/seat-scheme/edit/${row.seatSchemeId}`);
};

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
function searchReset() {
  searchFormRef.value?.resetFields();
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

function handleRowDelete(row: any) {
  batchDelete(row[pageConfig.id]).then(() => {
    search();
    ElMessage.success('删除成功');
  });
}

function searchRefresh() {
  searchReset();
  search();
}
</script>

<style lang="scss" scoped>
.table-view {
  .name {
    padding: 0 10px;
    font-size: 16px;
  }
}
</style>
