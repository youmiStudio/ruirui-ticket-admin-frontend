<template>
  <div>
    <el-dialog
      class="carousel-dialog"
      v-model="visible"
      :title="state.title"
      width="400px"
      @close="doClose()"
    >
      <el-form
        :model="form"
        :rules="rules"
        ref="formRef"
        label-position="right"
        label-width="85px"
        label-suffix=":"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="跳转路线" prop="routeId">
              <div v-if="form.routeId && form.routeName" class="mr-10px">{{
                form.routeName
              }}</div>
              <el-button type="primary" @click="routeDialogVisible = true"
                >选择</el-button
              >
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="图片" prop="original">
              <el-alert
                style="padding: 0px !important; margin-bottom: 10px"
                title="建议轮播图尺寸：750 * 478 像素"
                type="warning"
                :closable="false"
              />
              <upload-image
                class="carousel-upload"
                v-model="form.original"
              ></upload-image>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="排序" prop="sort">
              <el-alert
                style="padding: 0px !important; margin-bottom: 10px"
                title="数字越大，排序越靠前"
                type="warning"
                :closable="false"
              />
              <el-input-number v-model="form.sort" />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="状态" prop="status">
              <dict-radio
                v-model="form.status"
                type="sys_common_status"
              ></dict-radio>
            </el-form-item>
          </el-col>
        </el-row>
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

    <el-dialog
      class="dialog-body-p0"
      v-model="routeDialogVisible"
      title="选择路线"
      width="80%"
    >
      <route-page check-mode @check="checkRouteHandler"></route-page>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { Action } from './types';
import * as CAROUSEL_API from '@/api/business/carousel/index';
import type { FormInstance, FormRules } from 'element-plus';
import { CarouselVO } from '~/api/business/carousel/types';
import RoutePage from '@/views/business/route/index.vue';

type Mode = 'add' | 'edit';

const emit = defineEmits(['vanish', 'action']);

const props = defineProps({
  id: Number,
  userId: Number
});

const routeDialogVisible = ref<boolean>(false);
const formRef = ref<FormInstance>();
const id = ref<number>(props.id!);
const userId = ref<number>(props.userId!);
const visible = ref(false);
const state = reactive({
  title: '',
  mode: '' as Mode,
  action: '' as Action
});

const open = () => {
  if (visible.value) return;
  visible.value = true;
};

defineExpose({ open });

const form = ref<CarouselVO>({
  carouselId: undefined,
  routeId: undefined,
  sort: 0,
  original: '',
  routeName: '',
  status: '0'
});

const rules = ref<FormRules>({
  routeId: [
    {
      required: true,
      message: '请选择跳转路线',
      trigger: 'blur'
    }
  ],
  original: [
    {
      required: true,
      message: '请上传轮播图片',
      trigger: 'blur'
    }
  ],
  sort: [
    {
      required: true,
      message: '请设置轮播排序',
      trigger: 'blur'
    }
  ],
  status: [
    {
      required: true,
      message: '请选择轮播显示状态',
      trigger: 'blur'
    }
  ]
});

watch(
  () => state.mode,
  (mode) => {
    state.title = mode === 'add' ? '新增轮播图' : '修改轮播图';
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

const checkRouteHandler = (row: any) => {
  routeDialogVisible.value = false;
  form.value.routeId = row.routeId;
  form.value.routeName = row.routeName;
};

const getDetail = () => {
  CAROUSEL_API.detail(id.value).then((res) => {
    if (res.code === 200) {
      const { data } = res;
      form.value.carouselId = data?.carouselId;
      form.value.original = data?.original!;
      form.value.routeId = data?.routeId;
      form.value.routeName = data?.routeName!;
      form.value.sort = data?.sort!;
      form.value.status = data?.status!;
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
  const api = state.mode === 'add' ? CAROUSEL_API.save : CAROUSEL_API.edit;
  const params = Object.assign({}, form.value, { userId: userId.value });

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
