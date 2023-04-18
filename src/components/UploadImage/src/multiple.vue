<template>
  <div class="upload-image">
    <draggable
      class="image-list"
      v-model="imageList"
      tag="div"
      :animation="300"
      item-key="galleryId"
      @end="dragEndHandler"
    >
      <template #item="{ element, index }">
        <div class="image-list-item">
          <div class="close" @click.stop="deleteImageOfList(element)">
            <el-icon><CircleClose /></el-icon>
          </div>
          <el-image
            fit="cover"
            :src="element.original"
            :preview-src-list="[element.original]"
          ></el-image>
          <div v-if="index === 0" class="main-image">主图</div>
        </div>
      </template>
      <template #footer>
        <el-upload
          class="image-uploader"
          multiple
          accept=".png,.jpg,.jpeg"
          :show-file-list="false"
          :http-request="uploadHttpRequest"
          :before-upload="beforeUploadHandler"
          :on-success="uploadOnSuccess"
        >
          <el-icon class="image-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </template>
    </draggable>
  </div>
</template>

<script lang="ts" setup>
import draggable from 'vuedraggable';

import { Plus, CircleClose } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { UploadProps } from 'element-plus';

import { isImage } from '@/utils/is';
import { uploadFile } from '@/api/common/index';
import type { Gallery } from '../types';
import type { PropType } from 'vue';

const props = defineProps({
  modelValue: {
    type: Array as PropType<Gallery[]>,
    default: []
  }
});

const emit = defineEmits(['update:modelValue', 'success', 'delete']);
const imageList = ref<Gallery[]>([]);

nextTick(() => {
  imageList.value = [...props.modelValue];
});

watch(
  () => props.modelValue,
  (arr) => {
    if (imageList.value.length > 0 && arr.length === 0) {
      imageList.value = [];
    }
  },
  { deep: true }
);

watch(
  () => imageList.value,
  (arr) => {
    emit('update:modelValue', arr);
  },
  { deep: true }
);

const deleteImageOfList = (obj: Gallery) => {
  imageList.value = imageList.value.filter(
    (item) => item.galleryId !== obj.galleryId
  );
  emit('delete', obj);
};

const addImageOfList = (url: string) => {
  const time = new Date().getTime();
  const obj: Gallery = {
    galleryId: time + imageList.value.length + 1,
    original: url,
    sort: imageList.value.length + 1
  };
  imageList.value.push(obj);
};

const dragEndHandler = () => {
  imageList.value.forEach((item, index) => {
    item.sort = index;
  });
};

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

    addImageOfList(data.url);

    emit('success', data);
  }
};
</script>

<style lang="scss" scoped>
$--el-border-color: #dcdfe6;
$--el-transition-duration-fast: 0.2s;
$--el-color-primary: #409eff;
$--icon-width: 100px;
$--icon-height: 100px;

.upload-image {
  width: 100%;
}

.image-uploader {
  width: $--icon-width;
  height: $--icon-height;

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
}

.el-icon.image-uploader-icon {
  font-size: 14px;
  color: #8c939d;
  width: $--icon-width;
  height: $--icon-height;
  text-align: center;
}

.image-list {
  display: flex;
  flex-wrap: wrap;
  .image-list-item {
    position: relative;
    margin-right: 5px;
    margin-bottom: 5px;
    width: $--icon-width;
    height: $--icon-height;
    border: 1px dashed $--el-border-color;
    cursor: pointer;

    &:hover {
      .close {
        opacity: 100;
      }
    }

    .close {
      opacity: 0;
      z-index: 2;
      position: absolute;
      right: 5px;
      top: 0;
      transition: all 0.1s ease-in-out;
      &:hover {
        .el-icon {
          color: black;
        }
      }
    }

    .main-image {
      position: absolute;
      bottom: 0;
      padding: 0;
      width: 100%;
      height: 22px;
      line-height: 22px;
      text-align: center;
      color: #fff;
      background: rgba($color: $--el-color-primary, $alpha: 0.85);
    }

    :deep() {
      .el-image {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
