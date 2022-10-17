<!--
    表格
    @params: url  数据请求路径， 返回promise的方法
    @params: tree Boolean 是否是表格树结构
             lazy 异步加载 表格树数据
             @load 方法 lazy 一起使用
    @params: response 配置返回参数字段
              {                             res: {
                data: 获取数据字段              data: {
                list: 获取列表字段                   list: [],
                pageObj: 返回的分页信息是否是对象      pageObj: {
                resultCode: 返回的结果码                pageSize: 10,
                pageSize: 每页字段                     pageNum: 1,
                pageNum: 当前页字段                    totalRow: 100
                                                    }
                totalRow: 数据总数字段            },

              }                                 resultCode: 0
                                              }
    @params: page 分页配置
            pageSize: 查询请求的pageSize字段                  query: {            query: {
            pageNum: 查询请求的pageNum字段                      pageSize: 10,        pageObj: {
            pageObj: 查询请求的page是否是对象                    pageNum: 1             pageSize: 10,
            layout: 分页的布局, 参考element-ui的page的layout   }                        pageNum: 1
                                                                                   }
                                                                                }
    @params: successCode 成功码 0
    @params: pageSize 页数量
    @params: selectType  select／多选  radio／多选  false
    @params: showIndex 显示index列
    @params autoLoad 是否自动加载
    @params selectedIds 已经选择列表
    @params checkSelectable type=selection 的列有效，类型为 Function，Function 的返回值用来决定这一行的 CheckBox 是否可以勾选（同el-table）
    @params formatter 格式化table的data
    @slot="head-right" 头部右边
    @slot="search-tool"  搜索
    @slot="opr-tool"   表头的操作栏
    @slot="table-col"   表格的列
-->

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
      @current-change="handleCurrentChange"
      :page-size="pageSize"
      :current-page="currentPage"
      :layout="page.layout"
      :total="total"
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
        totalRow: 'totalRow'
      };
    }
  },
  page: {
    type: Object as PropType<PropsPageType>,
    default: () => {
      return {
        pageSize: 'pageSize',
        pageNum: 'pageNum',
        pageObj: 'pageVo',
        layout: 'total, prev, pager, next, jumper'
      };
    }
  },
  successCode: {
    type: [Number, String],
    default: 0
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
  }
});

defineExpose({
  refresh,
  search
})

const $emit = defineEmits([
  'on-success',
  'onError',
  'changePage',
  'row-click',
  'select-change',
  'select',
  'select-all'
]);

const tableloading = ref<boolean>(false);
const total = ref<number>(0);
const tableData = ref<any[]>([]);
const query = ref<any>();
const selectRow = ref<any[]>([]);
const recordRows = ref<any[]>([]);

const tableRef = ref<InstanceType<typeof ElTable>>();

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
    props.pageSize * (pageNum - 1),
    props.pageSize * pageNum
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
    console.log('radio');
    $emit('select-change', [row]);
    if (unref(selectRow).length > 0) {
      tableRef.value && tableRef.value.clearSelection();
    }
  }
  //   tableRef.value && tableRef.value.toggleRowSelection(row);
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
  unref(recordRows).forEach((row: any) => {
    const itemObj = unref(tableData).find((item) => item.id === row.id);
    if (itemObj) {
      tableRef.value && tableRef.value.toggleRowSelection(itemObj, true);
    }
  });
}

function handleCheckSelectable(row: any) {
  return props.checkSelectable(row);
}

function triggerRecords(row: any) {
  const recordIndex = unref(recordRows).findIndex((item) => item.id === row.id);
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
        (record) => record.id === item.id
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
    const ids = unref(tableData).map((item) => item.id);
    recordRows.value = unref(recordRows).filter(
      (item) => !ids.includes(item.id)
    );
    $emit('select-change', unref(recordRows));
  }
}

function clearRecord() {
  recordRows.value = [];
  setSelection();
}
</script>
<style scoped lang="scss"></style>
