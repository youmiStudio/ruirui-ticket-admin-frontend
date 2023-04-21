<template>
  <div class="app-container">
    <el-card class="mb-10px" shadow="never">
      <el-form ref="formRef" :model="form" :rules="rules">
        <el-row>
          <el-col :span="12">
            <el-form-item label="路线名称" prop="routeName">
              <el-input
                v-model="form.routeName"
                maxlength="20"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="出行时间" prop="beginTime">
              <el-date-picker
                v-model="travelDate"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :disabled-date="disabledDate"
                @change="datePickerChangeHandler"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="路线状态" prop="status">
              <dict-radio type="sys_route_status" v-model="form.status">
              </dict-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="路线图片" prop="gallery">
              <upload-image
                multiple
                v-model="form.gallery"
                idKey="routeGalleryId"
              ></upload-image>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form-item label="路线Sku" prop="sku">
              <draggable
                class="w100%"
                v-model="form.sku"
                tag="div"
                :animation="300"
                item-key="routeSkuId"
                handle=".handle"
                @end="dragEndHandler"
              >
                <template #item="{ element }">
                  <el-row class="w100% mb-10px" :gutter="10">
                    <el-col :span="10">
                      <el-input
                        v-model="element.name"
                        maxlength="25"
                        show-word-limit
                      ></el-input>
                    </el-col>
                    <el-col v-if="element.car" :span="10">
                      <span
                        >{{ element.car?.carName }} --
                        {{ element.car?.carNo }}</span
                      >
                    </el-col>
                    <el-col class="form-operation" :span="24">
                      <el-button
                        class="mr-10px"
                        link
                        type="primary"
                        :icon="Setting"
                        @click="openCarDialog(element.routeSkuId)"
                        >选择车辆</el-button
                      >

                      <el-button
                        class="handle mr-10px"
                        link
                        type="warning"
                        :icon="Sort"
                        >拖动排序</el-button
                      >
                      <el-button
                        class="mr-10px"
                        link
                        type="danger"
                        :icon="Delete"
                        @click="deleteRouteSku(element.routeSkuId)"
                        >删除</el-button
                      >
                    </el-col>
                  </el-row>
                </template>
                <template #footer>
                  <el-button type="primary" @click="addRouteSku" :icon="Plus"
                    >添加</el-button
                  >
                </template>
              </draggable>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="路线描述" prop="routeDescribe">
              <el-input
                show-word-limit
                v-model="form.routeDescribe"
                placeholder="路线描述"
                type="textarea"
                :row="5"
                maxlength="100"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="路线详情" prop="routeDetail">
              <vue3-tinymce
                v-model="form.routeDetail"
                :setting="state.setting"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="flex flex-row-reverse">
        <el-button class="ml-10px" type="primary" @click="submitHandler"
          >保存</el-button
        >
        <el-button @click="goBack">取消</el-button>
      </div>
    </el-card>

    <el-dialog
      class="dialog-body-p0"
      v-model="carDialogVisible"
      title="选择车辆"
      width="80%"
    >
      <car-page check-mode @check="checkCarHandler"></car-page>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import Vue3Tinymce from '@jsdawn/vue3-tinymce';
import draggable from 'vuedraggable';
import { Plus, Setting, Delete, Sort } from '@element-plus/icons-vue';
import CarPage from '@/views/business/car/index.vue';
import { parseTime } from '@/utils';
import type { RouteDTO, RouteSku } from '@/api/business/route/types';
import { CarVo } from '~/api/business/car/types';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';

import { useGlobSettings } from '@/hooks/settings/useGlobSettings';
import { getToken } from '~/utils/auth';

import { addRoute, editRoute, getRoute } from '@/api/business/route';

const route = useRoute();
const router = useRouter();

const travelDate = ref<any>();
const carDialogVisible = ref<boolean>();
const currentSkuId = ref<number>();
const pageMode = ref<'add' | 'edit'>();

const routeId = ref<number>();

watch(
  () => route.params,
  (params) => {
    pageMode.value = params.routeId ? 'edit' : 'add';
  },
  { immediate: true, deep: true }
);

watch(
  pageMode,
  (mode) => {
    if (mode === 'edit') {
      routeId.value = Number(route.params.routeId);
      getRouteInfo();
    }
  },
  { immediate: true, deep: true }
);

const state = reactive({
  setting: {
    width: '100%',
    height: 250,
    custom_images_upload: true,
    language: 'zh-Hans',
    language_url: '/tinymce/langs/zh-Hans.js',
    menubar: false,
    toolbar:
      'bold italic underline h1 h2 blockquote codesample numlist bullist link image | removeformat fullscreen',
    plugins: 'codesample link image table lists fullscreen',
    toolbar_mode: 'sliding',
    nonbreaking_force_tab: true,
    link_title: false,
    link_default_target: '_blank',
    content_style: 'body{font-size: 16px}',
    images_upload_url: `${useGlobSettings().apiUrl}/common/upload`,
    // 上传成功回调函数，return 图片地址。默认 response.location
    custom_images_upload_callback: (response: any) => response.data.url,
    // 上传 api 请求头
    custom_images_upload_header: { Authorization: getToken() }
  }
});

const formRef = ref<FormInstance>();

const form = ref<RouteDTO>({
  routeId: undefined,
  routeName: '',
  routeDescribe: '',
  routeDetail: '',
  mainImgUrl: '',
  beginTime: '',
  endTime: '',
  status: '0',
  gallery: [],
  sku: []
});

const rules = ref<FormRules>({
  routeName: [{ required: true, message: '路线名称不能为空', trigger: 'blur' }],
  beginTime: [{ required: true, message: '出行时间不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '路线状态不能为空', trigger: 'blur' }],
  gallery: [
    {
      required: true,
      validator: (rule, value, callback) => {
        if (rule.required && (!value || value.length === 0)) {
          return callback(new Error('请选择路线图片'));
        }
        callback();
      },
      trigger: 'blur'
    }
  ],
  sku: [
    {
      required: true,
      validator: (rule, value, callback) => {
        if (rule.required && (!value || value.length === 0)) {
          return callback(new Error('请设置路线sku'));
        }
        value.forEach((sku: RouteSku) => {
          if (!sku.name) {
            return callback(new Error('请输入路线sku名称'));
          }
        });
        callback();
      },
      trigger: 'blur'
    }
  ],
  routeDetail: [
    { required: true, message: '路线详情不能为空', trigger: 'blur' }
  ],
  routeDescribe: [
    { required: true, message: '路线描述不能为空', trigger: 'blur' }
  ]
});

function getRouteInfo() {
  const setDateToDatePicker = (beginTime: string, endTime: string) => {
    travelDate.value = [new Date(beginTime), new Date(endTime)];
  };
  getRoute(routeId.value!).then((res) => {
    if (res.code === 200) {
      const { data } = res;
      if (!data) return;
      Object.keys(data).forEach((key) => {
        if (Object.hasOwn(form.value, key)) {
          form.value[key] = data[key];
        }
      });
      setDateToDatePicker(data.beginTime, data.endTime);
    }
  });
}

const addRouteSku = () => {
  const nowTime = new Date().getTime();
  const len = form.value.sku.length;
  form.value.sku.push({
    routeSkuId: nowTime + len + 1,
    name: '',
    carId: 0,
    sort: 0,
    car: undefined,
    flag: 'local'
  });
};

const openCarDialog = (skuId: number) => {
  currentSkuId.value = skuId;
  carDialogVisible.value = true;
};

const datePickerChangeHandler = (value: Array<Date>) => {
  const beginDate = parseTime(value[0], '{y}-{m}-{d}');
  const endDate = parseTime(value[1], '{y}-{m}-{d}');

  form.value.beginTime = beginDate!;
  form.value.endTime = endDate!;
};

const disabledDate = (date: Date) => {
  const dateTime = date.getTime();
  const nowDateString = parseTime(new Date(), '{y}-{m}-{d} 00:00:00');
  const nowDate = new Date(nowDateString!);
  const nowDateTime = nowDate.getTime();

  if (dateTime >= nowDateTime) return false;

  return true;
};

const deleteRouteSku = (skuId: number) => {
  form.value.sku = form.value.sku.filter((sku) => sku.routeSkuId !== skuId);
};

const dragEndHandler = () => {
  form.value.sku.forEach((sku, index) => {
    sku.sort = index;
  });
};

const checkCarHandler = (car: CarVo) => {
  form.value.sku.forEach((sku) => {
    if (sku.routeSkuId === currentSkuId.value) {
      sku.car = car;
      sku.carId = car.carId;
    }
  });
  currentSkuId.value = undefined;
  carDialogVisible.value = false;
};

const goBack = () => {
  router.push('/ticket/route');
};

const submitHandler = () => {
  const api = pageMode.value === 'add' ? addRoute : editRoute;
  formRef.value?.validate((valid) => {
    if (valid) {
      form.value.mainImgUrl = form.value.gallery[0].original;
      form.value.sku.forEach((sku) => {
        if (sku.flag === 'local') {
          sku.routeSkuId = undefined;
        }
      });
      api(form.value).then((res) => {
        if (res.code === 200) {
          if (pageMode.value === 'add') {
            const { data } = res;
            if (!data) return;
            router.push(`/ticket/route/detail/${data.routeId}`);
            setTimeout(() => {
              window.location.reload();
            }, 300);
          } else {
            getRouteInfo();
          }
          ElMessage.success('保存成功');
        }
      });
    }
  });
};
</script>

<style lang="scss" scoped>
:deep() {
  .form-operation {
    .el-button {
      + & {
        margin-left: 0;
      }
    }
  }
}
</style>
