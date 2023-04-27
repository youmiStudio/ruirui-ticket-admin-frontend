<template>
  <el-dialog v-model="visible" :title="state.title" width="400px" @close="doClose()">
    <el-form
      :model="form"
      :rules="rules"
      ref="formRef"
      label-position="right"
      label-width="85px"
      label-suffix=":"
    >
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name" maxlength="5" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="证件类型" prop="idType">
        <dict-select
          class="w100%"
          type="sys_passenger_idType"
          v-model="form.idType"
        ></dict-select>
      </el-form-item>
      <el-form-item label="证件号码" prop="idNumber">
        <el-input
          v-model="form.idNumber"
          maxlength="18"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input
          v-model="form.phone"
          maxlength="11"
          show-word-limit
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleAction('close')">取消</el-button>
        <el-button type="primary" @click="handleAction('confirm')">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { Action } from './types';
import {
  addPassenger,
  editPassenger,
  getPassenger
} from '@/api/business/passenger/index';
import type { FormInstance, FormRules } from 'element-plus';
import { PassengerDTO } from '~/api/business/passenger/types';
import { encrypt } from '@/utils/rsa';
import AES from '@/utils/aes';

type Mode = 'add' | 'edit';

const emit = defineEmits(['vanish', 'action']);

const formRef = ref<FormInstance>();
const id = ref<number>();
const userId = ref<number>();
const visible = ref(false);
const state = reactive({
  title: '',
  mode: '' as Mode,
  action: '' as Action
});

const form = ref<PassengerDTO>({
  passengerId: undefined,
  userId: undefined,
  name: '',
  idType: '0',
  idNumber: '',
  phone: ''
});

const rules = ref<FormRules>({
  name: [
    {
      required: true,
      message: '乘车人姓名不能为空',
      trigger: 'blur'
    }
  ],
  idType: [
    {
      required: true,
      message: '证件类型不能为空',
      trigger: 'blur'
    }
  ],
  idNumber: [
    {
      required: true,
      message: '证件号码不能为空',
      trigger: 'blur'
    }
  ],
  phone: [
    {
      required: true,
      message: '手机号不能为空',
      trigger: 'blur'
    }
  ]
});

watch(
  () => state.mode,
  (mode) => {
    state.title = mode === 'add' ? '新增乘车人' : '修改乘车人';
  }
);

nextTick(() => {
  setMode();
  if (state.mode === 'edit') {
    getDetail();
  }
});

const setMode = () => {
  state.mode = id.value ? 'edit' : 'add';
};

const getDetail = () => {
  getPassenger(id.value!).then((res) => {
    if (res.code === 200) {
      const { data } = res;
      if (!data) return;
      form.value['name'] = AES.decrypt(data.name);
      form.value['idNumber'] = AES.decrypt(data.idNumber);
      form.value['idType'] = data.idType;
      form.value['passengerId'] = data.passengerId;
      form.value['phone'] = AES.decrypt(data.phone);
      form.value['userId'] = data.userId;
    }
  });
};

const doClose = () => {
  if (!visible.value) return;
  visible.value = false;

  nextTick(() => {
    if (state.action) emit('action', state.action);
    setTimeout(() => {
      emit('vanish');
    }, 300);
  });
};

const validate = () => {
  return new Promise((resolve, reject) => {
    formRef.value?.validate((valid, fields) => {
      if (valid) {
        resolve(valid);
      } else {
        reject(fields);
      }
    });
  });
};

const doSubmit = async () => {
  const rsaEncrypt = (params: any) => {
    params.name = encrypt(params.name) as string;
    params.idNumber = encrypt(params.idNumber) as string;
    params.phone = encrypt(params.phone) as string;
  };
  const api = state.mode === 'add' ? addPassenger : editPassenger;
  const params = Object.assign({}, form.value, { userId: userId.value });

  rsaEncrypt(params);

  const res = await api(params);
  if (res.code === 200) {
    return Promise.resolve();
  }
  return Promise.reject();
};

const handleAction = (action: Action) => {
  const close = () => {
    state.action = action;
    doClose();
  };
  if (action !== 'confirm') {
    close();
    return;
  }
  validate().then(() => {
    doSubmit().then(() => {
      close();
    });
  });
};
</script>
<style lang="scss" scoped></style>
