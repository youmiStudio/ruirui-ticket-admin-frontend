<template>
  <el-dialog v-model="visible" :title="state.title" width="400px">
    <el-form
      :model="seat"
      :rules="rules"
      ref="seatForm"
      label-position="top"
      label-width="120px"
    >
      <el-form-item label="座位名称" prop="seatName">
        <el-input v-model="seat.seatName"></el-input>
      </el-form-item>
      <el-form-item label="座位价格（元）" prop="price">
        <el-input v-model="seat.price"></el-input>
      </el-form-item>
      <el-form-item label="座位状态" prop="status">
        <dict-radio
          class="w100%"
          type="sys_normal_disable"
          v-model="seat.status"
        ></dict-radio>
      </el-form-item>
      <el-form-item label="座位描述">
        <el-input v-model="seat.seatDescribe" type="textarea"></el-input>
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
import { SeatVo } from '@/api/business/seat/types';
import { addSeat, editSeat, getSeat } from '@/api/business/seat/index';
import type { FormInstance, FormRules } from 'element-plus';
import type { InternalRuleItem } from 'async-validator/dist-types/interface';
import { isAmount, isImage } from '@/utils/is';

import { yuanToFen, fenToYuan } from '@/utils/price';
import { da } from 'element-plus/es/locale';

type Mode = 'add' | 'edit';

const emit = defineEmits(['vanish', 'action']);

const seatForm = ref<FormInstance>();
const id = ref<number>();
const visible = ref(false);
const state = reactive({
  title: '',
  mode: '' as Mode,
  action: '' as Action
});

const seat = ref<SeatVo>({
  seatName: '',
  seatDescribe: '',
  price: 1,
  status: '0'
});
const validatePrice = (
  rule: InternalRuleItem,
  value: string,
  callback: Function
) => {
  if (rule.required && !value) {
    return callback(new Error('请输入金额'));
  }
  if (value && !isAmount(value)) {
    return callback(new Error('请输入正确的金额, 最多保留2位小数'));
  }
  callback();
};

const rules = ref<FormRules>({
  seatName: [
    { required: true, message: '座位名称不能为空', trigger: 'blur' },
    { min: 1, max: 50, message: '座位名称长度不能超过50', trigger: 'blur' }
  ],
  price: [{ required: true, validator: validatePrice, trigger: 'blur' }],
  status: [{ required: true, message: '座位状态不能为空', trigger: 'change' }]
});

watch(
  () => state.mode,
  (mode) => {
    state.title = mode === 'add' ? '新增座位' : '修改座位';
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
  getSeat(id.value!).then((res) => {
    if (res.code === 200) {
      const { data } = res;
      if (!data) return;
      Object.keys(data).forEach((key) => {
        if (Object.hasOwn(seat.value, key)) {
          seat.value[key] = data[key];
        }
      });
      seat.value.seatId = data.seatId;
      seat.value.price = fenToYuan(seat.value.price);
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
    seatForm.value?.validate((valid, fields) => {
      if (valid) {
        resolve(valid);
      } else {
        reject(fields);
      }
    });
  });
};

const doSubmit = async () => {
  const api = state.mode === 'add' ? addSeat : editSeat;
  const params = Object.assign({}, seat.value, {
    price: yuanToFen(seat.value.price)
  });

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
