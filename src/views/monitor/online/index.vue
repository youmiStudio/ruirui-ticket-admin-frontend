<template>
  <div class="app-container">
    <el-card class="mb-10px" shadow="never">
      <el-form ref="searchFormRef" :model="searchForm">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="用户名称" prop="userName">
              <el-input
                v-model="searchForm.userName"
                placeholder="请输入用户名称"
                clearable
                maxlength="20"
                @clear="search"
                @change="search"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="登录IP地址" prop="userName">
              <el-input
                v-model="searchForm.ipaddr"
                placeholder="请输入登录IP地址"
                clearable
                maxlength="20"
                @clear="search"
                @change="search"
              ></el-input>
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

      <TablePanel
        ref="tableRef"
        showIndex
        :url="fetchList"
        :primary-key="pageConfig.id"
        :select-type="false"
      >
        <el-table-column
          label="会话编号"
          align="center"
          prop="tokenId"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="登录名称"
          align="center"
          prop="userName"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="主机"
          align="center"
          prop="ipaddr"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="登录地点"
          align="center"
          prop="loginLocation"
          :show-overflow-tooltip="true"
        />
        <el-table-column label="浏览器" align="center" prop="browser" />
        <el-table-column label="操作系统" align="center" prop="os" />
        <el-table-column label="创建时间" width="150px" align="center">
          <template #default="{ row }">
            <span>{{
              row.loginTime && parseTime(row.loginTime, '{y}-{m}-{d} {h}:{i}')
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          class-name="fixed-width"
        >
          <template #default="{ row }"> 
            <div class="flex align-center justify-center">
              <el-button
                v-authority="[pageConfig.authorites.forceLogout]"
                size="small"
                link
                type="danger"
                :icon="Delete"
                @click.stop="handleForceLogout(row)"
                >强退</el-button>
            </div>
          </template>
        </el-table-column>
      </TablePanel>
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
  DArrowRight,
  Key,
  CircleCheck
} from '@element-plus/icons-vue';
import { parseTime } from '@/utils';

import TablePanel from '@/components/TablePanel/index.vue';
import { useDebounceFn } from '@vueuse/shared';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessageBox, ElMessage } from 'element-plus';
import { vAuthority } from '@/directive/authority';

import { onlineUserList, forceLogout } from '@/api/monitor/online/index';
import type {
  OnlineUserVo,
  OnlineUserSearchBody
} from '@/api/monitor/online/types';

type ModelSearchBody = OnlineUserSearchBody;
type ModelVo = OnlineUserVo;

/**
 * 页面配置，抽离公共部分，少搬点砖
 */
const pageConfig = reactive({
  id: 'tokenId',
  api: {
    list: onlineUserList,
    forceLogout: forceLogout
  },
  authorites: {
    list: 'monitor:online:list',
    forceLogout: 'monitor:online:forceLogout'
  }
});
const tableRef = ref<InstanceType<typeof TablePanel>>();
const searchFormRef = ref<FormInstance>();

const searchForm = reactive<ModelSearchBody>({
  ipaddr: '',
  userName: ''
});

onMounted(() => {
  search();
});

const search = useDebounceFn(() => {
  tableRef.value && tableRef.value.search<ModelVo>({ ...searchForm });
}, 200);

function fetchList(obj: ModelSearchBody) {
  return pageConfig.api.list({
    ...obj
  });
}

function searchReset() {
  searchFormRef.value?.resetFields();
}

function searchRefresh() {
  searchReset();
  search();
}

function handleForceLogout(row:ModelVo) {
  ElMessageBox.confirm(
      `是否确认要强退名称为“${row.userName}”的用户？`,
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
      .then(() => {
        pageConfig.api.forceLogout(row.tokenId).then(res=>{
          if(res.code === 200) {
            ElMessage.success("强退用户成功")
          }
        })
      })
      .catch(() => {});
}
</script>

<style lang="scss" scoped></style>
