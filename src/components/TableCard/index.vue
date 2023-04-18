<template>
  <div>
    <el-row class="table-card" :gutter="20">
      <el-col
        v-for="(item, index) in data"
        :key="index"
        :span="8"
        @click="clickHandler(item)"
      >
        <div class="table-card-item">
          <div class="table-card-item__content">
            <slot :element="item" :index="index"></slot>
          </div>
          <div class="table-card-item__operator">
            <el-button
              v-authority="authority.edit"
              v-if="showSetting"
              link
              type="primary"
              :icon="Setting"
              @click="editHandler(item)"
              >编辑</el-button
            >
            <el-button
              v-authority="authority.delete"
              v-if="showDelete"
              link
              type="danger"
              :icon="Delete"
              @click="deleteHandler(item)"
              >删除</el-button
            >
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="mt20px flex flex-row-reverse">
      <el-pagination
        v-model:current-page="pageNum"
        v-model:page-size="pageSize"
        small
        background
        :page-sizes="pageSizes"
        :layout="page.layout"
        :total="pageToal"
        @size-change="search"
        @current-change="search"
      ></el-pagination>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Delete, Setting } from '@element-plus/icons-vue';
import type { PropsPageType } from './types';
import { vAuthority } from '@/directive/authority';

const props = defineProps({
  url: {
    type: Function,
    require: true
  },
  showSetting: {
    type: Boolean,
    default: true
  },
  showDelete: {
    type: Boolean,
    default: true
  },
  authority: {
    type: Object,
    default: () => {
      return {
        edit: [],
        delete: []
      };
    }
  },
  responseType: {
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
  successCode: {
    type: [Number, String],
    default: 200
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
  pageSizes: {
    type: Array<number>,
    default: () => [9, 18, 27, 36]
  },
  pageSize: {
    type: Number,
    default: 9
  }
});

const emit = defineEmits(['click', 'delete', 'edit']);

const data = ref<Array<any>>([]);
const pageToal = ref<number>(0);
const pageSize = ref<number>(props.pageSize);
const pageNum = ref<number>(1);

const getQuery = () => {
  const params = {};
  params[props.page.pageSize] = pageSize.value;
  params[props.page.pageNum] = pageNum.value;
  return params;
};

const search = () => {
  if (!props.url) return;

  const params = getQuery();

  props.url(params).then((res: any) => {
    if (props.successCode !== res[props.responseType.resultCode]) return;
    const resData = res[props.responseType.data];
    const list = resData[props.responseType.list];
    const pageTotal = resData[props.responseType.totalRow];

    data.value = list;
    pageToal.value = pageTotal;
  });
};

const clickHandler = (obj: any) => {
  emit('click', obj);
};

const editHandler = (obj: any) => {
  emit('edit', obj);
};
const deleteHandler = (obj: any) => {
  emit('delete', obj);
};
defineExpose({ search });
</script>

<style lang="scss" scoped>
$--el-color-primary: #409eff;

.table-card-item {
  display: flex;
  flex-direction: column;
  width: 100%;
  // min-height: 100px;
  border-radius: 2px;
  box-shadow: 0px 0px 5px 1px rgba($color: #000000, $alpha: 0.1);
  transition: all 0.3s ease-in-out;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 1px 0px 10px 1px rgba($color: #000000, $alpha: 0.1);
  }

  + & {
    margin-top: 20px;
  }

  .table-card-item__content {
    flex: 1 0;
  }
  .table-card-item__operator {
    padding: 10px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    :deep() {
      .el-button {
        + & {
          margin: 0;
        }
      }
    }
  }
}
</style>
