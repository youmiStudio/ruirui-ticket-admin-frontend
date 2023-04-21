<!-- @author zhengjie -->
<template>
  <div class="icon-body">
    <el-input
      v-model="name"
      style="position: relative"
      clearable
      placeholder="请输入图标名称"
      @clear="filterIcons"
      @input.native="filterIcons"
    >
      <i slot="suffix" class="el-icon-search el-input__icon" />
    </el-input>
    <div class="icon-list">
      <div
        v-for="(item, index) in iconList"
        :key="index"
        @click="selectedIcon(item)"
      >
        <svg-icon class-name="mr10px" :icon-class="item" style="height: 30px; width: 16px" />
        <span>{{ item }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="IconSelect">
import icons from './requireIcons';

defineExpose({reset})
const $emit = defineEmits(['selected']);

const name = ref<string>('');
const iconList = ref(icons);

function filterIcons() {
  iconList.value = icons;
  if (name.value) {
    iconList.value = iconList.value.filter((item: any) =>
      item.includes(name.value)
    );
  }
}
function selectedIcon(name: string) {
  $emit('selected', name);
}

function reset() {
  name.value = '';
  iconList.value = icons;
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.icon-body {
  width: 100%;
  padding: 10px;
  .icon-list {
    height: 200px;
    overflow-y: scroll;
    div {
      height: 30px;
      line-height: 30px;
      margin-bottom: -5px;
      cursor: pointer;
      width: 33%;
      float: left;
    }
    span {
      display: inline-block;
      vertical-align: -0.15em;
      fill: currentColor;
      overflow: hidden;
    }
  }
}
</style>
