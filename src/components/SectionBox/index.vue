<template>
  <div class="section-box">
    <div class="section-box__header">
      <div class="section-box__titleWrap">
        <div class="section-box__title">
          <span>{{ props.title }}</span>
        </div>
        <div class="section-box__subTitle">{{ props.subTitle }}</div>
      </div>
      <div class="section-box__cmdBox">
        <slot name="cmd"></slot>
      </div>
    </div>
    <div>
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  subTitle: {
    type: String,
    required: true
  }
});
</script>

<style lang="scss" scoped>
.section-box {
  padding: 0 16px 16px;
  background: #fff;
  border-radius: 4px;
  +.section-box {
    margin-top: 15px;
  }
  .section-box__header {
    display: flex;
    align-items: center;
    min-height: 22px;
    font-size: 12px;
  }
  .section-box__titleWrap {
    display: flex;
    align-items: center;
    margin: 16px 0px;
  }
  .section-box__title {
    color: #333;
    font-size: 16px;
  }
  .section-box__subTitle {
    color: #666;
    margin-left: 8px;
  }

  .section-box__cmdBox {
    margin-left: auto;
  }
}
</style>
