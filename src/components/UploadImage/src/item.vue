<template>
  <div>
    <el-upload
      class="avatar-uploader"
      :show-file-list="false"
      accept=".png,.jpg,.jpeg"
      :http-request="uploadHttpRequest"
      :before-upload="beforeUploadHandler"
      :on-success="uploadOnSuccess"
    >
      <el-icon v-if="!value" class="avatar-uploader-icon"><Plus /></el-icon>
      <img v-else class="avatar" :src="value" alt=""/>
    </el-upload>
    <div v-if="showLabel" class="mt-10px">{{ label }}</div>
  </div>
</template>

<script lang="ts" setup>
import { Plus } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { UploadProps } from 'element-plus';

import { useGlobSettings } from '@/hooks/settings/useGlobSettings';
import { isImage } from '@/utils/is';
import { uploadFile } from '@/api/common/index';

const props = defineProps({
  label: {
    type: String
  },
  showLabel: {
    type: Boolean,
    default: true
  },
  modelValue: {
    type: String
  }
});

const emit = defineEmits(['update:modelValue', 'success']);

const value = computed({
  get: () => {
    if (!props.modelValue) return;
    return props.modelValue;
  },
  set: (value) => {
    if (value && value.startsWith('/profile')) {
      emit('update:modelValue', useGlobSettings().apiUrl + value);
      return;
    }
    emit('update:modelValue', value);
  }
});

const beforeUploadHandler: UploadProps['beforeUpload'] = (rawFile) => {
  if (!isImage(rawFile.type)) {
    ElMessage.error('Avatar picture must be JPG format!');
    return false;
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!');
    return false;
  }
  return true;
};

const uploadHttpRequest: UploadProps['httpRequest'] = (options) => {
  const { file } = options;
  let form = new FormData();
  form.append('file', file);
  return uploadFile(form);
};

const uploadOnSuccess: UploadProps['onSuccess'] = (res, uploadFile) => {
  if (res.code === 200) {
    const { data } = res;
    value.value = data.fileName;
    emit('success', data);
  }
};
</script>

<style lang="scss" scoped>
.avatar-uploader {
  width: 100%;
  :deep(.el-upload) {
    width: 100%;
    height: 100%;
  }
  .avatar-uploader-icon {
    width: 100%;
  }
}

.avatar {
  -webkit-user-drag: none;
}
</style>
