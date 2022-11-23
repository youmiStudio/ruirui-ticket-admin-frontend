<template>
  <div class="app-container">
    <el-card>
      <el-descriptions title="基本信息" :column="3" border>
        <el-descriptions-item
          label="用户昵称"
          label-align="right"
          align="center"
          width="150px"
          >{{ userInfo && userInfo.nickname }}</el-descriptions-item
        >
        <el-descriptions-item
          label="用户账号"
          label-align="right"
          align="center"
          width="150px"
          >{{ userInfo && userInfo.username }}</el-descriptions-item
        >
        <el-descriptions-item
          label="手机号"
          label-align="right"
          align="center"
          width="150px"
          >{{ userInfo && userInfo.phoneNumber }}</el-descriptions-item
        >
      </el-descriptions>
      <h4>角色信息</h4>
      <table-panel
        ref="tableRef"
        primary-key="roleId"
        :page-size="50"
        :page-sizes="[50]"
        :url="fetchList"
        @on-success="handleTableGetDataOnSuccess"
      >
        <el-table-column
          label="角色编号"
          prop="roleId"
          align="center"
        ></el-table-column>
        <el-table-column
          label="角色名称"
          prop="roleName"
          align="center"
        ></el-table-column>
        <el-table-column
          label="权限字符"
          prop="roleKey"
          align="center"
        ></el-table-column>
        <el-table-column label="创建时间" width="150px" align="center">
          <template #default="{ row }">
            <span>{{
              row.createTime && parseTime(row.createTime, '{y}-{m}-{d} {h}:{i}')
            }}</span>
          </template>
        </el-table-column>
      </table-panel>

      <div class="flex justify-center mt10px">
        <el-button type="primary" @click="handleSumbit">提交</el-button>
        <el-button @click="goBack">返回</el-button>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import TablePanel from '@/components/TablePanel/index.vue';
import { getUser, editUser } from '@/api/user/index';
import { roleList } from '@/api/role/index';
import { useDebounceFn } from '@vueuse/shared';
import { UserVo } from '~/api/user/types';
import { parseTime } from '@/utils';
import { RoleVo } from '~/api/role/types';
import { ElMessage, ElMessageBox } from 'element-plus';

const $route = useRoute();
const $router = useRouter();

const { params } = $route;
const { userId } = params;

const userInfo = ref<UserVo>();
const tableData = ref<RoleVo[]>();
const tableRef = ref<InstanceType<typeof TablePanel>>();

const search = useDebounceFn(() => {
  tableRef.value && tableRef.value.search();
}, 200);

onMounted(() => {
  handleGetInfo();
  search();
});

function fetchList(params: any) {
  return roleList({
    ...params,
    orderByColumn: 'roleId',
    isAsc: 'desc'
  });
}

function handleGetInfo() {
  getUser(userId as string).then((res) => {
    const { data } = res;
    userInfo.value = data;
  });
}

/**
 * select table row by user roles.
 */
function selectTableRowsByUserRoles() {
  const selectList = tableData.value?.filter((row) =>
    userInfo.value?.roles.some((role) => role.roleId === row.roleId)
  );
  tableRef.value && tableRef.value.triggerRecordsAll(selectList);
}

function handleTableGetDataOnSuccess(res: any) {
  const {
    data: { items }
  } = res;
  tableData.value = items;
  selectTableRowsByUserRoles();
}

function handleSumbit() {
  if (!userInfo.value) return;
  ElMessageBox.confirm(
    `确定要给[${userInfo.value.nickname}]重新分配角色吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    }
  )
    .then(() => {
      if (!tableRef.value) {
        return;
      }
      const { recordRows } = tableRef.value;
      const selectIds = recordRows.map((row) => row.roleId);
      const userRoleIds = userInfo.value?.roles.map((role) => role.roleId);

      // if roles not change
      if (selectIds.toString() === userRoleIds?.toString()) {
        return;
      }

      editUser({
        userId: userId as string,
        roleIds: selectIds
      }).then((res) => {
        if (res.code === 200) {
          ElMessage.success('分配角色成功');
          $router.go(0);
        }
      });
    })
    .catch(() => {});
}

function goBack() {
  $router.go(-1);
}
</script>

<style lang="scss" scoped></style>
