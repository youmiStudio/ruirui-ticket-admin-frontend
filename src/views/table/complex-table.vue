<template>
  <div class="app-container">
    <TablePanel
      ref="tableRef"
      :url="fetchList"
      :response="response"
      :pageSize="pageSize"
      @changePage="handleChangePage"
    >
      <el-table-column label="ID" sortable="custom" align="center" width="80">
        <template #default="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Date" width="150px" align="center">
        <template #default="{ row }">
          <span>{{
            row.timestamp && parseTime(row.timestamp, '{y}-{m}-{d} {h}:{i}')
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Title" min-width="150px">
        <template #default="{ row }">
          <span class="link-type">{{ row.title }}</span>
          <el-tag>{{ row.type }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Author" width="110px" align="center">
        <template #default="{ row }">
          <span>{{ row.author }}</span>
        </template>
      </el-table-column>
    </TablePanel>
  </div>
</template>

<script lang="ts" setup name="complex-table">
import TablePanel from '@/components/TablePanel/index.vue';
import { fetchList } from '@/api/article/index';
import { parseTime } from '@/utils';

const response = ref<object>({
  data: 'data',
  list: 'items',
  resultCode: 'code',
  pageObj: false,
  totalRow: 'total'
});

const pageSize = ref<number>(10);
const tableRef = ref<InstanceType<typeof TablePanel>>();

const requestParams = {
  limit: pageSize.value
};

onMounted(() => {
  tableRef.value && tableRef.value.search({ ...requestParams });
});

function handleChangePage(pageNum: number) {
  tableRef.value && tableRef.value.search({ ...requestParams, page: pageNum });
}
</script>

<style lang="scss" scoped></style>
