<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :span="8">
        <el-card style="height: calc(100vh - 105px)">
          <template #header>
            <div class="card-header">
              <span>缓存列表</span>
              <el-button
                class="button"
                text
                type="primary"
                style="float: right; padding: 3px 0; height: auto"
                :icon="Refresh"
                @click="handleCacheNameRefresh"
              ></el-button>
            </div>
          </template>
          <table-panel
            show-index
            highlight-current-row
            :data-value="cacheNames"
            :has-pagination="false"
            :select-type="false"
            @row-click="handleCacheNameClick"
          >
            <el-table-column
              label="缓存名称"
              align="center"
              prop="cacheName"
              :show-overflow-tooltip="true"
              :formatter="cacheNameFormatter"
            ></el-table-column>

            <el-table-column
              label="备注"
              align="center"
              prop="remark"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="操作"
              align="center"
              width="60"
              class-name="fixed-width"
            >
              <template #default="{ row }">
                <div class="flex align-center justify-center">
                  <el-button
                    size="small"
                    link
                    type="primary"
                    :icon="Delete"
                    @click.stop="handleCacheNameClear(row)"
                  ></el-button>
                </div>
              </template>
            </el-table-column>
          </table-panel>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card style="height: calc(100vh - 105px)">
          <template #header>
            <div class="card-header">
              <span>键名列表</span>
              <el-button
                class="button"
                text
                type="primary"
                style="float: right; padding: 3px 0; height: auto"
                :icon="Refresh"
                @click="handleCacheKeyRefresh"
              ></el-button>
            </div>
          </template>
          <table-panel
            show-index
            highlight-current-row
            :data-value="keysList"
            :has-pagination="false"
            :select-type="false"
            @row-click="handleKeyNameClick"
          >
            <el-table-column
              label="缓存名称"
              align="center"
              :show-overflow-tooltip="true"
              :formatter="keyNameFormatter"
            ></el-table-column>

            <el-table-column
              label="操作"
              align="center"
              width="60"
              class-name="fixed-width"
            >
              <template #default="{ row }">
                <div class="flex align-center justify-center">
                  <el-button
                    size="small"
                    link
                    type="primary"
                    :icon="Delete"
                    @click.stop="handleCacheKeyClear(row)"
                  ></el-button>
                </div>
              </template>
            </el-table-column>
          </table-panel>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card style="height: calc(100vh - 105px)">
          <template #header>
            <div class="card-header">
              <span>缓存内容</span>
              <el-button
                class="button"
                text
                type="primary"
                style="float: right; padding: 3px 0; height: auto"
                :icon="Refresh"
                @click="handleClearAll"
                >清理全部</el-button
              >
            </div>
          </template>
          <el-form label-position="top" :model="cacheForm">
            <el-form-item label="缓存名称:" prop="cacheName">
              <el-input v-model="cacheForm.cacheName" readonly />
            </el-form-item>
            <el-form-item label="缓存键名:" prop="cacheKey">
              <el-input v-model="cacheForm.cacheKey" readonly />
            </el-form-item>
            <el-form-item label="缓存内容:" prop="cacheValue">
              <el-input
                v-model="cacheForm.cacheValue"
                type="textarea"
                :rows="8"
                readonly
              />
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import TablePanel from '@/components/TablePanel/index.vue';
import { Refresh, Delete } from '@element-plus/icons-vue';
import {
  getNames,
  getKeys,
  getValue,
  clearCacheAll,
  clearCacheKey,
  clearCacheName
} from '@/api/monitor/cache';
import type { SysCacheVo } from '@/api/monitor/cache/types';
import { ElMessage } from 'element-plus';

const cacheNames = ref<SysCacheVo[]>([]);
const keysList = ref<string[]>([]);
const nowCacheName = ref<string>('');

const cacheForm = ref<SysCacheVo>({
  cacheKey: '',
  cacheName: '',
  cacheValue: '',
  remark: ''
});

onMounted(() => {
  getCacheNamesList();
});

function getCacheNamesList() {
  getNames().then((res) => {
    if (res.data) {
      cacheNames.value = res.data;
    }
  });
}

function getKeysByCacheName() {
  keysList.value = [];
  getKeys(nowCacheName.value).then((res) => {
    if (res.data) {
      keysList.value = res.data;
    }
  });
}

function handleCacheNameClick(row: any) {
  nowCacheName.value = row.cacheName;
  getKeysByCacheName();
}

function handleKeyNameClick(cacheKey: string) {
  getValue(nowCacheName.value, cacheKey).then((res) => {
    if (res.data) {
      cacheForm.value = res.data;
    }
  });
}

function cacheNameFormatter(row: any): string {
  return row.cacheName.replace(':', '');
}

function keyNameFormatter(cacheKey: any): string {
  return cacheKey.replace(nowCacheName.value, '');
}

function handleCacheNameRefresh() {
  getCacheNamesList();
  ElMessage.success('刷新缓存列表成功');
}

function handleCacheNameClear(row: SysCacheVo) {
  clearCacheName(row.cacheName).then((res) => {
    if (res.code === 200) {
      ElMessage.success(`清理缓存名称[${row.cacheName}]成功`);
      getCacheNamesList()
    }
  });
}

function handleCacheKeyRefresh() {
  getKeysByCacheName();
  ElMessage.success('刷新键名列表成功');
}

function handleCacheKeyClear(key: string) {
  clearCacheKey(key).then((res) => {
    if (res.code === 200) {
      ElMessage.success(`清理缓存键名[${key}]成功`);
      getKeysByCacheName()
    }
  });
}

function handleClearAll() {
  clearCacheAll().then(res=>{
    if(res.code === 200) {
      ElMessage.success("清理全部缓存成功")
    }
  })
}
</script>

<style lang="scss" scoped></style>
