<template>
  <el-table :data="list" style="width: 100%; padding-top: 15px">
    <el-table-column label="Order_No" min-width="200">
      <template #default="scope">
        {{ scope.row.order_no && orderNoFilter(scope.row.order_no) }}
      </template>
    </el-table-column>
    <el-table-column label="Price" width="195" align="center">
      <template #default="scope">
        ¥{{ scope.row.price && toThousandFilter(scope.row.price) }}
      </template>
    </el-table-column>
    <el-table-column label="Status" width="100" align="center">
      <template #default="scope">
        <el-tag :type="scope.row.status && statusFilter(scope.row.status)">
          {{ scope.row.status }}
        </el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
import { toThousandFilter } from '@/utils/filters';
// import { transactionList } from '@/api/list/remote-search';
// import type * as TransactionListAPI from '@/api/list/types';
const statusFilter = computed(() => {
  return (status: 'success' | 'pending' | any) => {
    const statusMap = {
      success: 'success',
      pending: 'danger'
    } as any;
    return statusMap[status];
  };
});

const orderNoFilter = computed(() => {
  return (str: string) => {
    return str.substring(0, 30);
  };
});

const list = ref();

// onMounted(() => {
//   fetchData();
// });

// function fetchData() {
//   transactionList().then((response) => {
//     list.value = response.data.items.slice(0, 8);
//   });
// }
</script>
