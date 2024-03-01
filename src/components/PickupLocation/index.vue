<template>
  <el-dialog class="dialog-body-p0" v-model="visible" :title="state.title" width="80vw" @close="doClose()">
    <!-- <iframe
      allow="geolocation; microphone; camera; midi; encrypted-media;"
      ref="iframeRef"
      class="w100%"
      style="height: 60vh"
      :src="`https://m.amap.com/picker/?key=608d75903d29ad471362f8c58c550daf&center=${center}`"
    ></iframe> -->
    <a-map-pickup @pick="sureAddress"></a-map-pickup>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { Action } from './types';
import AMapPickup from './AMapPickup.vue'

defineProps({
  center: {
    type: String,
    defalut: ''
  }
});

const emit = defineEmits(['vanish', 'action']);

const iframeRef = ref();
const visible = ref(false);
const state = reactive({
  title: '请选择上车地点',
  action: '' as Action
});
// const center = ref<string>();

const open = () => {
  if (visible.value) return;
  visible.value = true;
};

defineExpose({ open });

// watch(
//   () => iframeRef.value,
//   () => {
//     if (!iframeRef.value) return;

//     const iframe = iframeRef.value;
//     iframe.onload = function () {
//       iframe.contentWindow.postMessage('hello', 'https://m.amap.com/picker/');
//     };
//     window.addEventListener(
//       'message',
//       function (e) {
//         emit('action', { action: 'confrim', data: e.data });
//         doClose();
//       },
//       false
//     );
//   },
//   { immediate: true }
// );

const sureAddress = (data: any) => {

  const location: any = {
    name: data.name,
    address: data.address,
    location: `${data.location.lng},${data.location.lat}`
  }

  emit('action', { action: 'confrim', data: location });
  doClose();
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

const doSubmit = async () => { };

const handleAction = (action: Action) => {
  const close = () => {
    state.action = action;
    doClose();
  };
  if (action !== 'confirm') {
    close();
    return;
  }
  doSubmit().then(() => {
    close();
  });
};
</script>
<style lang="scss" scoped></style>
