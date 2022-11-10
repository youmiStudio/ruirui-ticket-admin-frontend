<template>
  <div class="table-panel" :class="{ 'table-panel-tree': tree }">
    <div v-if="title" class="t-title">
      <span v-html="title"></span>
      <div class="tips-right"><slot name="head-right"></slot></div>
    </div>
    <div class="search-tool" v-if="$slots['search-tool']">
      <slot name="search-tool"></slot>
    </div>
    <div class="opr-tool" v-if="$slots['opr-tool']">
      <slot name="opr-tool"></slot>
    </div>
    <div class="select-container" v-if="selectText"
      >当前选<span class="f-success">{{ recordRows.length }}</span
      >条
    </div>
    <el-table
      ref="tableRef"
      :data="tableData"
      v-loading="tableloading"
      @selection-change="handleSelectionChange"
      @select-all="selectAll"
      @select="handleRowSelect"
      @row-click="handleRowClick"
      v-bind="$attrs"
    >
      <el-table-column
        v-if="selectType"
        type="selection"
        width="55"
        align="center"
        :selectable="handleCheckSelectable"
      ></el-table-column>
      <el-table-column
        v-if="showIndex"
        label="序号"
        type="index"
        width="50"
        align="center"
      ></el-table-column>
      <slot></slot>
      <div class="empty-img" slot="empty">
        <img src="@/assets/images/empty.png" />
      </div>
    </el-table>
    <el-pagination
      v-if="page"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      small
      background
      :page-sizes="pageSizes"
      :layout="page.layout"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>
    <slot name="bottom"></slot>
  </div>
</template>

<script lang="ts" setup name="tablePanel">
import type { ElTable } from 'element-plus';
import type { PropsPageType } from './types';
import { deepClone } from '@/utils';
import type { PropType } from 'vue';

const props = defineProps({
  title: String,
  tree: Boolean,
  url: {
    type: [Function, Boolean],
    default: false
  },
  dataValue: {
    type: Array,
    default: () => []
  },
  response: {
    type: Object,
    default: () => {
      return {
        data: 'data',
        list: 'items',
        resultCode: 'code',
        pageObj: false,
        totalRow: 'total'
      };
    }
  },
  page: {
    type: Object as PropType<PropsPageType>,
    default: () => {
      return {
        pageSize: 'pageSize',
        pageNum: 'pageNum',
        pageObj: '',
        layout: 'total, sizes, prev, pager, next, jumper'
      };
    }
  },
  successCode: {
    type: [Number, String],
    default: 200
  },
  pageSizes: {
    type: Array,
    default: () => [10, 20, 30, 50]
  },
  pageSize: {
    type: Number,
    default: 10
  },
  selectType: {
    type: [Boolean, String],
    default: 'select'
  },
  showIndex: {
    type: Boolean,
    default: false
  },
  autoLoad: {
    type: Boolean,
    default: false
  },
  selectedIds: {
    type: Array,
    default: () => []
  },
  checkSelectable: {
    type: Function,
    default: () => {
      return true;
    }
  },
  formatter: {
    type: [Boolean, Function],
    default: false
  },
  selectText: {
    type: Boolean,
    default: false
  },
  keyName: {
    type: String,
    default: 'name'
  },
  primaryKey: {
    type: String,
    default: 'id'
  }
});

const $emit = defineEmits([
  'on-success',
  'onError',
  'changePage',
  'row-click',
  'select-change',
  'select',
  'select-all',
  'changeSize'
]);

const tableloading = ref<boolean>(false);
const total = ref<number>(0);
const tableData = ref<any[]>([]);
const query = ref<any>();
const selectRow = ref<any[]>([]);
const recordRows = ref<any[]>([]);
const pageSize = ref(props.pageSize);

const tableRef = ref<InstanceType<typeof ElTable>>();

defineExpose({
  refresh,
  search,
  clearRecord
});

onBeforeMount(() => {
  initPageObj();
  if (props.url && typeof props.url === 'function') {
    props.autoLoad && loadData(unref(query));
  } else {
    initStaticData(props.dataValue, 1);
  }
});

const currentPage = computed(() => {
  const { pageNum, pageObj } = props.page;
  if (pageObj) {
    return unref(query)[pageObj][pageNum];
  } else {
    return unref(query)[pageNum];
  }
});

const currentSelectNames = computed(() => {
  return unref(recordRows).reduce((prev: any, cur: any) => {
    return `${prev}${cur[props.keyName]}, `;
  }, '');
});

watch(
  props.dataValue,
  (newVal) => {
    initStaticData(newVal, 1);
  },
  { deep: true }
);

watch(
  props.selectedIds,
  (newVal: any) => {
    nextTick(() => {
      recordRows.value = newVal.map((item: any) => Object.assign({}, item));
      setSelection();
    });
  },
  { immediate: true, deep: true }
);

/**
 * Get table data through request.
 * You need configure the props.respons props.successCode and props.formatter.
 * @param {Object} params request params.
 */
function loadData(params: any) {
  const { data, resultCode, list, pageObj, totalRow } = props.response;
  tableloading.value = true;

  typeof props.url === 'function' &&
    props
      .url(params)
      .then((res: any) => {
        const resultData = data ? res[data] : res;
        tableloading.value = false;
        if (+res[resultCode] === +props.successCode) {
          $emit('on-success', res);
          if (typeof props.formatter === 'function') {
            tableData.value = props.formatter(res);
          } else {
            tableData.value = resultData[list];
          }
          nextTick(() => {
            setSelection();
          });
          if (pageObj) {
            total.value = resultData[pageObj][totalRow];
          } else {
            total.value = resultData[totalRow];
          }
        } else {
          $emit('onError', res);
        }
      })
      .catch((err: ErrorEvent) => {
        $emit('onError', err);
        tableloading.value = false;
      });
}

/**
 * Get table data again.
 */
function refresh() {
  loadData(unref(query));
}

/**
 * Load data of array.
 * @param {Array} dataList
 * @param {Number} pageNum
 */
function initStaticData(dataList: any[], pageNum: number) {
  const list = deepClone(dataList);
  total.value = list.length;
  tableData.value = list.slice(
    pageSize.value * (pageNum - 1),
    pageSize.value * pageNum
  );
  nextTick(() => {
    setSelection();
  });
}

/**
 * If the request parameters change, you can execute this function if you want to request the table data again.
 * The page number will become 1 after the function is executed.
 * @param {Object} params request params
 */
function search(params?: any) {
  setQueryPage(1);
  const p = Object.assign({}, unref(query), params);
  query.value = deepClone(p);
  if (props.url && typeof props.url === 'function') {
    loadData(unref(query));
  } else {
    initStaticData(props.dataValue, 1);
  }
}

/**
 * This function will be executed when el-pagination page change.
 * @param {Number} curpage
 */
function handleCurrentChange(curpage: number) {
  $emit('changePage', curpage);
  setQueryPage(curpage);
  if (props.url && typeof props.url === 'function') {
    loadData(unref(query));
  } else {
    initStaticData(props.dataValue, curpage);
  }
}

function handleRowClick(row: any) {
  $emit('row-click', row);
  triggerRecords(row);
  if (props.selectType === 'radio') {
    $emit('select-change', [row]);
    if (unref(selectRow).length > 0) {
      tableRef.value && tableRef.value.clearSelection();
    }
  }

  tableRef.value &&
    tableRef.value.toggleRowSelection(
      row,
      recordRows.value.some(
        (item) => item[props.primaryKey] === row[props.primaryKey]
      )
    );
}

function handleSelectionChange(val: any) {
  selectRow.value = val;
  if (props.selectType === 'select') {
    $emit('select-change', unref(recordRows));
  }
}

function setQueryPage(curpage: any) {
  const { pageNum, pageObj } = props.page;
  if (pageObj) {
    unref(query)[pageObj][pageNum] = curpage;
  } else {
    unref(query)[pageNum] = curpage;
  }
}
function setQueryPageSize(size: number) {
  const { pageSize, pageObj } = props.page;
  if (pageObj) {
    unref(query)[pageObj][pageSize] = size;
  } else {
    unref(query)[pageSize] = size;
  }
}

function initPageObj() {
  const { pageSize, pageNum, pageObj } = props.page;
  const obj = {} as any;
  if (pageObj) {
    obj[pageObj] = {};
    obj[pageObj][pageSize] = props.pageSize;
    obj[pageObj][pageNum] = 1;
  } else {
    obj[pageSize] = props.pageSize;
    obj[pageNum] = 1;
  }
  query.value = deepClone(obj);
}

function handleRowSelect(val: any, row: any) {
  $emit('select', val, row);
  triggerRecords(row);
  nextTick(() => {
    if (props.selectType === 'radio') {
      handleRowClick(row);
    }
  });
}

function selectAll(rows: any) {
  $emit('select-all', rows);
  triggerRecordsAll(rows);
  if (props.selectType === 'radio') {
    tableRef.value && tableRef.value.clearSelection();
  }
}

function setSelection() {
  tableRef.value && tableRef.value.clearSelection();

  recordRows.value = recordRows.value.filter((row) =>
    tableData.value.some(
      (tRow) => tRow[props.primaryKey] === row[props.primaryKey]
    )
  );

  unref(recordRows).forEach((row: any) => {
    const itemObj = unref(tableData).find(
      (item) => item[props.primaryKey] === row[props.primaryKey]
    );
    if (itemObj) {
      tableRef.value && tableRef.value.toggleRowSelection(itemObj, true);
    }
  });

  $emit('select-change', unref(recordRows));
}

function handleCheckSelectable(row: any) {
  return props.checkSelectable(row);
}

function triggerRecords(row: any) {
  const recordIndex = unref(recordRows).findIndex(
    (item) => item[props.primaryKey] === row[props.primaryKey]
  );
  if (recordIndex > -1) {
    if (props.selectType === 'select') {
      unref(recordRows).splice(recordIndex, 1);
    }
  } else {
    if (props.selectType === 'radio') {
      recordRows.value = [row];
    } else if (props.selectType === 'select') {
      recordRows.value.push(row);
    }
  }
}

function triggerRecordsAll(rows: any) {
  if (rows.length) {
    rows.forEach((item: any) => {
      const inRecord = unref(recordRows).find(
        (record) => record[props.primaryKey] === item[props.primaryKey]
      );
      if (!inRecord) {
        triggerRecords(item);
      }
    });
  } else {
    clearRecordSingleList();
  }
}

function clearRecordSingleList() {
  if (unref(tableData) && unref(tableData).length) {
    const ids = unref(tableData).map((item) => item[props.primaryKey]);
    recordRows.value = unref(recordRows).filter(
      (item) => !ids.includes(item[props.primaryKey])
    );
    $emit('select-change', unref(recordRows));
  }
}

function clearRecord() {
  recordRows.value = [];
  setSelection();
}

function handleSizeChange(size: number) {
  $emit('changeSize', size);
  setQueryPageSize(size);
  if (props.url && typeof props.url === 'function') {
    loadData(unref(query));
  } else {
    initStaticData(props.dataValue, currentPage.value);
  }
}
</script>
<style scoped lang="scss">
.el-pagination {
  margin-top: 10px;
  justify-content: right;
}
</style>
