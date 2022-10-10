<template>
  <div>
    <svg-icon
      :icon-class="isFullscreen ? 'exit-fullscreen' : 'fullscreen'"
      @click="click"
    />
  </div>
</template>

<script lang="ts" setup name="Screenfull">
import { ElMessage } from 'element-plus';
import screenfull from 'screenfull';

const isFullscreen = ref(false);

onBeforeMount(()=>{
  init()
})

onUnmounted(()=>{
  destroy()
})

function change() {
  isFullscreen.value = screenfull.isFullscreen;
}

function init() {
  if (screenfull.isEnabled) {
    screenfull.on('change', change);
  }
}

function click() {
  if (!screenfull.isEnabled) {
    ElMessage({
      message: 'you browser can not work',
      type: 'warning'
    });
    return false;
  }
  screenfull.toggle();
}

function destroy() {
  if (screenfull.isEnabled) {
    screenfull.off('change', change);
  }
}
</script>

<style scoped>
.screenfull-svg {
  display: inline-block;
  cursor: pointer;
  fill: #5a5e66;
  width: 20px;
  height: 20px;
  vertical-align: 10px;
}
</style>
