<template>
  <div class="app-container">
    <el-card class="mb-10px" shadow="never">
      <el-form ref="searchFormRef" :model="searchForm">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="用户名称" prop="userName">
              <el-input
                v-model="searchForm.username"
                placeholder="请输入用户名称"
                clearable
                maxlength="20"
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
                placeholder="用户状态"
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

      <el-row :gutter="10" class="mb8">
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
        <el-col :span="1.5">
          <el-button
            v-authority="[pageConfig.authorites.remove]"
            type="danger"
            plain
            size="small"
            :icon="Delete"
            :disabled="batchDeleteDisable"
            @click="handleBatchDelete"
            >删除</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            v-authority="[pageConfig.authorites.export]"
            type="warning"
            plain
            size="small"
            :icon="Download"
            @click="handleExport"
            >导出</el-button
          >
        </el-col>
      </el-row>

      <TablePanel
        ref="tableRef"
        :show-expand="checkAuthority([pageConfig.authorites.passenger.list])"
        :url="fetchList"
        :primary-key="pageConfig.id"
        @select-change="handleTableSelectChange"
        @expand-change="handleExpandChange"
      >
        <template #expand="{ row }">
          <div class="p-15px">
            <el-table border :data="passengerMap[row.userId]">
              <el-table-column label="乘车人姓名" prop="name">
              </el-table-column>
              <el-table-column label="手机号码" prop="phone"> </el-table-column>
              <el-table-column label="证件类型" prop="idType">
                <template #default="{ row }">
                  <dict-tag
                    :options="dicts.type.sys_passenger_idType"
                    :value="row.idType"
                  ></dict-tag>
                </template>
              </el-table-column>
              <el-table-column label="证件号码" prop="idNumber">
              </el-table-column>
              <el-table-column label="操作">
                <template #default="{ row }">
                  <el-button
                    v-authority="[pageConfig.authorites.passenger.edit]"
                    size="small"
                    link
                    type="primary"
                    :icon="Edit"
                    @click.stop="handlePassengerEdit(row)"
                    >修改</el-button
                  >

                  <el-button
                    v-authority="[pageConfig.authorites.passenger.remove]"
                    link
                    size="small"
                    type="danger"
                    :key="row[pageConfig.id]"
                    :icon="Delete"
                    @click.stop="handlePassengerDelete(row)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
        <el-table-column
          label="用户编号"
          prop="userId"
          sortable="custom"
          align="center"
        >
        </el-table-column>

        <el-table-column
          label="用户账号"
          prop="username"
          align="center"
          :show-overflow-tooltip="true"
        >
        </el-table-column>

        <el-table-column
          label="用户昵称"
          prop="nickname"
          align="center"
          :show-overflow-tooltip="true"
        >
        </el-table-column>

        <el-table-column
          width="120"
          label="用户头像"
          prop="phoneNumber"
          align="center"
        >
          <template #default="{ row }">
            <el-image class="w-50px h-50px" :src="row.avatar"></el-image>
          </template>
        </el-table-column>

        <el-table-column label="状态" align="center">
          <template #default="{ row }">
            <DictTag
              :options="dicts.type.sys_common_status"
              :value="row.status"
            ></DictTag>
          </template>
        </el-table-column>

        <el-table-column label="创建时间" width="150px" align="center">
          <template #default="{ row }">
            <span>{{
              row.createTime && parseTime(row.createTime, '{y}-{m}-{d} {h}:{i}')
            }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="备注"
          prop="remark"
          align="center"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          width="200px"
          label="操作"
          align="center"
          class-name="align-center"
        >
          <template #default="{ row }">
            <div
              class="flex align-center justify-center"
              v-if="row.userId !== 1"
            >
              <el-button
                v-authority="[pageConfig.authorites.edit]"
                size="small"
                link
                type="primary"
                :icon="Edit"
                @click.stop="handleEdit(row)"
                >修改</el-button
              >

              <el-button
                v-authority="[pageConfig.authorites.remove]"
                link
                size="small"
                type="danger"
                :key="row[pageConfig.id]"
                :icon="Delete"
                @click.stop="handleRowDelete(row)"
                >删除</el-button
              >

              <el-dropdown
                class="ml12px"
                @command="(command: string)=>handleCommand(command,row)"
                v-authority="[
                  pageConfig.authorites.resetPwd,
                  pageConfig.authorites.edit
                ]"
              >
                <el-button link size="small" type="primary" :icon="DArrowRight"
                  >更多</el-button
                >
                <template #dropdown>
                  <el-dropdown-menu>
                    <div v-authority="[pageConfig.authorites.resetPwd]">
                      <el-dropdown-item command="handleResetPwd" :icon="Key"
                        >重置密码</el-dropdown-item
                      >
                    </div>
                    <div v-authority="[pageConfig.authorites.edit]">
                      <el-dropdown-item
                        command="handleAuthRole"
                        :icon="CircleCheck"
                        >分配角色</el-dropdown-item
                      >
                    </div>
                    <div v-authority="[pageConfig.authorites.passenger.add]">
                      <el-dropdown-item
                        command="handleAddPassenger"
                        :icon="CircleCheck"
                        >新增乘车人</el-dropdown-item
                      >
                    </div>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
        </el-table-column>
      </TablePanel>
    </el-card>

    <el-dialog
      v-model="dialogState.dialogVisible"
      :title="dialogState.title"
      width="550px"
      append-to-body
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="用户名称" prop="username">
                  <el-input
                    v-model="form.username"
                    placeholder="请输入用户名称"
                    maxlength="30"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="用户密码" prop="password">
                  <el-input
                    v-model="form.password"
                    type="password"
                    placeholder="请输入用户密码"
                    maxlength="50"
                    :show-password="true"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>

          <el-col :span="24">
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="用户昵称" prop="nickname">
                  <el-input
                    v-model="form.nickname"
                    placeholder="请输入用户昵称"
                    maxlength="30"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="手机号码" prop="phoneNumber">
                  <el-input
                    v-model="form.phoneNumber"
                    placeholder="请输入手机号码"
                    maxlength="11"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>

          <el-col :span="24">
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="性别" prop="sex">
                  <el-select
                    class="w100%"
                    v-model="form.sex"
                    placeholder="用户性别"
                  >
                    <el-option
                      v-for="dict in dicts.type.sys_user_sex"
                      :label="dict.label"
                      :value="dict.value"
                      :key="dict.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="角色" prop="roleIds">
                  <el-select
                    class="w100%"
                    v-model="form.roleIds"
                    multiple
                    placeholder="用户角色"
                  >
                    <el-option
                      v-for="role in roleOptions"
                      :label="role.roleName"
                      :value="role.roleId"
                      :key="role.roleId"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>

          <el-col :span="24">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in dicts.type.sys_common_status"
                  :key="dict.value"
                  :label="dict.value"
                  >{{ dict.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input
                v-model="form.remark"
                placeholder="请输入内容"
                type="textarea"
                :row="2"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="submitForm" :loading="formLoading">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
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
import TablePanel from '@/components/TablePanel/index.vue';
import useDictTypes from '@/hooks/web/useDictTypes';
import {
  userList,
  getUser,
  addUser,
  removeUser,
  editUser,
  exportUser,
  resetPwdUser
} from '@/api/system/user/index';
import { parseTime } from '@/utils';
import { ElMessageBox, ElMessage, RowClassNameGetter } from 'element-plus';
import { useDebounceFn } from '@vueuse/shared';
import { vAuthority } from '@/directive/authority';
import { isPhone } from '@/utils/is';

import type { InternalRuleItem } from 'async-validator/dist-types/interface';
import type { FormInstance, FormRules } from 'element-plus';
import type { UserSearchBody, UserBody, UserVo } from '~/api/system/user/types';

import { RoleVo } from '@/api/system/role/types';
import { roleOptionList } from '@/api/system/role';
import { passengerList, deletePssenger } from '@/api/business/passenger/index';

import PassengerBox from './PassengerBox/index';
import { PassengerDTO, PassengerVO } from '~/api/business/passenger/types';
import { emitWarning } from 'process';
import { encrypt } from '@/utils/rsa';
import { checkAuthority} from '@/utils/permission'

import AES from '@/utils/aes';

type ModelSearchBody = UserSearchBody;
type ModelBody = UserBody;
type ModelVo = UserVo;

/**
 * 页面配置，抽离公共部分，少搬点砖
 */
const pageConfig = reactive({
  title: '用户',
  id: 'userId',
  isAsc: 'desc',
  orderByColumn: 'user_id',
  api: {
    list: userList,
    get: getUser,
    add: addUser,
    remove: removeUser,
    edit: editUser,
    export: exportUser,
    resetPwd: resetPwdUser
  },
  authorites: {
    list: 'system:user:list',
    get: 'system:user:query',
    add: 'system:user:add',
    edit: 'system:user:edit',
    remove: 'system:user:remove',
    export: 'system:user:export',
    resetPwd: 'system:user:resetPwd',
    passenger: {
      list: 'ticket:passenger:list',
      get: 'ticket:passenger:query',
      add: 'ticket:passenger:add',
      edit: 'ticket:passenger:edit',
      remove: 'ticket:passenger:remove'
    }
  }
});

const validatePhoneNumber = (
  rule: InternalRuleItem,
  value: string,
  callback: Function
) => {
  if (value && !isPhone(value)) {
    callback(new Error('请输入正确的手机号码'));
  } else {
    callback();
  }
};

const dicts = useDictTypes([
  'sys_common_status',
  'sys_user_sex',
  'sys_passenger_idType'
]);
const tableRef = ref<InstanceType<typeof TablePanel>>();
const formRef = ref<FormInstance>();
const searchFormRef = ref<FormInstance>();
const formLoading = ref<boolean>(false);
const batchDeleteDisable = ref<boolean>(true);
const tableRecordRows = ref<ModelVo[]>([]);

const searchForm = reactive<ModelSearchBody>({
  username: '',
  status: ''
});

const rules = reactive<FormRules>({
  username: [
    { required: true, message: '用户名称不能为空', trigger: 'blur' },
    {
      min: 2,
      max: 30,
      message: '用户名称长度必须介于 2 和 30 之间',
      trigger: 'blur'
    }
  ],
  password: [{ required: true, message: '用户密码不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '状态必须选择', trigger: 'blur' }],
  nickname: [{ required: true, message: '用户昵称不能为空', trigger: 'blur' }],
  roleIds: [{ required: true, message: '用户角色不能为空', trigger: 'blur' }],
  phoneNumber: [{ validator: validatePhoneNumber, trigger: 'blur' }]
});

let form = reactive<ModelBody>({
  userId: '',
  username: '',
  password: '',
  status: '0',
  remark: '',
  phoneNumber: '',
  nickname: '',
  sex: '',
  roleIds: []
});

const dialogState = reactive({
  title: '',
  dialogVisible: false
});

const passengerMap = ref<Record<number, PassengerVO[]>>({});

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
  tableRef.value && tableRef.value.search<ModelVo>({ ...searchForm });
}, 200);

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

function fetchList(obj: ModelSearchBody) {
  return pageConfig.api.list({
    ...obj,
    orderByColumn: pageConfig.orderByColumn,
    isAsc: pageConfig.isAsc
  });
}

function handleAdd() {
  getRoleOptions();
  formReset();
  dialogState.title = `添加${pageConfig.title}`;
  dialogState.dialogVisible = true;
}

function handleEdit(row: any) {
  getRoleOptions();
  formReset();
  dialogState.title = `修改${pageConfig.title}`;
  dialogState.dialogVisible = true;
  getDetail(row[pageConfig.id]).then((data) => {
    Object.keys(form).forEach((key) => {
      if (key in data) {
        form[key] = data[key];
      }
    });
    form.roleIds = data.roles.map((role) => role.roleId);
  });
}

function handleExport() {
  pageConfig.api.export(searchForm);
}

function getDetail(id: number): Promise<ModelVo> {
  return new Promise((resolve, reject) => {
    pageConfig.api.get(id).then((res) => {
      const { data } = res;
      if (data) {
        resolve(data);
      }
    });
  });
}

function handleRowDelete(row: any) {
  batchDelete(row[pageConfig.id]).then(() => {
    search();
    ElMessage.success('删除成功');
  });
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

function clearTableRecordRows() {
  if (!tableRef.value) return;
  tableRef.value.clearRecord();
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

function submitForm() {
  formRef.value?.validate((valid) => {
    if (valid) {
      formLoading.value = true;
      const isAdd = form[pageConfig.id] === null;
      const api = isAdd ? pageConfig.api.add : pageConfig.api.edit;
      form.username = encrypt(form.username) as string;
      form.password = encrypt(form.password) as string;
      api(form).then((res) => {
        const { code } = res;
        if (code !== 200) {
          formLoading.value = false;
          return;
        }
        search();
        formReset();
        dialogState.dialogVisible = false;
        formLoading.value = false;
        ElMessage.success(`${pageConfig.title}${isAdd ? '新增' : '编辑'}成功`);
      });
    }
  });
}

function cancel() {
  dialogState.dialogVisible = false;
  formReset();
}

/* --------------------Extra Features Start-------------------- */
defineExpose({ handleAuthRole, handleResetPwd, handleAddPassenger });

const instance = getCurrentInstance();

const $router = useRouter();
const roleOptions = ref<RoleVo[]>();
function getRoleOptions() {
  roleOptionList().then((res) => {
    const { data } = res;
    if (data) {
      roleOptions.value = data;
    }
  });
}
/** 分配角色操作 */
function handleAuthRole(row: ModelVo) {
  const userId = row.userId;
  $router.push('/system/user-auth/role/' + userId);
}

function handleResetPwd(row: ModelVo) {
  ElMessageBox.prompt(`请输入"${row.username}"的新密码`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputPattern: /^.{5,20}$/,
    inputErrorMessage: '用户密码长度必须介于 5 和 20 之间'
  })
    .then(({ value }) => {
      pageConfig.api
        .resetPwd({
          userId: row.userId,
          password: value
        })
        .then((res) => {
          const { code } = res;
          if (code === 200) {
            ElMessage.success(`"${row.username}"的密码修改成功`);
          }
        });
    })
    .catch(() => {});
}

function handleCommand(command: string, row: ModelVo) {
  const { exposed } = instance as any;
  exposed[command](row);
}

function handleAddPassenger(row: any) {
  PassengerBox.show({
    userId: row.userId
  })
    .then(() => {})
    .catch(() => {});
}

function handleExpandChange(row: any, expandRows: any[]) {
  expandRows.forEach((item) => {
    if (item.userId === row.userId) {
      fetchPassengerList(row);
    }
  });
}

function fetchPassengerList(row: any) {
  passengerList(row.userId).then((res) => {
    if (res.code === 200) {
      const { data } = res;
      if (!data) {
        passengerMap.value[row.userId] = [];
        return;
      }

      passengerMap.value[row.userId] = [...data].map(aesDecryptPassenger);
    }
  });
}

function aesDecryptPassenger(passenger: PassengerVO) {
  passenger.name = AES.decrypt(passenger.name);
  passenger.phone = AES.decrypt(passenger.phone);
  passenger.idNumber = AES.decrypt(passenger.idNumber);
  return passenger;
}

function handlePassengerEdit(row: any) {
  PassengerBox.show({
    userId: row.userId,
    id: row.passengerId
  })
    .then(() => {
      fetchPassengerList(row);
      ElMessage.success('保存成功');
    })
    .catch(() => {});
}

function handlePassengerDelete(row: any) {
  ElMessageBox.confirm(`确定要删除乘车人"${row.name}"的数据项吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      deletePssenger(row.passengerId).then((res) => {
        if (res.code === 200) {
          ElMessage.success('删除乘车人成功');
          fetchPassengerList(row);
        }
      });
    })
    .catch(() => {});
}

/* --------------------Extra Features End-------------------- */
</script>

<style lang="scss" scoped>
:deep() {
  .el-button:focus-visible {
    outline: none;
  }
}
</style>
