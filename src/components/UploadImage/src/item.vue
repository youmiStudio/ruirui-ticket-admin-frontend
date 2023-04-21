<template>
  <div>
    <el-upload
      class="image-uploader"
      :show-file-list="false"
      accept=".png,.jpg,.jpeg"
      :http-request="uploadHttpRequest"
      :before-upload="beforeUploadHandler"
      :on-success="uploadOnSuccess"
    >
      <el-icon v-if="!value" class="image-uploader-icon"><Plus /></el-icon>
      <img v-else class="preview" :src="url + value" alt="" />
    </el-upload>
    <div v-if="showLabel" class="mt-10px">{{ label }}</div>
  </div>
</template>

<script lang="ts" setup>
import { Plus } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { UploadProps } from 'element-plus';

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
  },
  url: {
    type: String,
    default:''
  }
});

const emit = defineEmits(['update:modelValue', 'success']);

const value = computed({
  get: () => {
    if (!props.modelValue) return;
    return props.modelValue;
  },
  set: (value) => {
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
    value.value = data.url;
    emit('success', data);
  }
};
</script>

<style lang="scss" scoped>
$--el-border-color: #dcdfe6;
$--el-transition-duration-fast: 0.2s;
$--el-color-primary: #409eff;
$--icon-width: 50px;
$--icon-height: 50px;

.image-uploader {
  width: 100%;
  
  .image-uploader-icon {
    width: 100%;
  }

  :deep() {
    .el-upload {
      width: 100%;
      height: 100%;
      border: 1px dashed $--el-border-color;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: $--el-transition-duration-fast;

      &:hover {
        border-color: $--el-color-primary;
      }
    }
  }

  .preview {
    width: $--icon-width;
    height: $--icon-height;
    -webkit-user-drag: none;
  }
}

.el-icon.image-uploader-icon {
  font-size: 14px;
  color: #8c939d;
  width: $--icon-width;
  height: $--icon-height;
  text-align: center;
}
</style>
