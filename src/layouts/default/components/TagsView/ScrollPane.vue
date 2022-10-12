<template>
  <el-scrollbar
    ref="scrollContainer"
    :vertical="false"
    class="scroll-container"
    @wheel.native.prevent="handleScroll"
  >
    <slot />
  </el-scrollbar>
</template>

<script lang="ts" setup name="ScrollPane">
import { ElScrollbar } from 'element-plus';

defineExpose({
  moveToTarget
});

const $emit = defineEmits(['scroll']);

const tagAndTagSpacing = 4; // tagAndTagSpacing
const left = ref<number>(0);

const scrollContainer = ref<
  InstanceType<typeof ElScrollbar> & {
    $refs: Record<string, HTMLDivElement>;
  }
>();

const scrollWrapper = computed(() => scrollContainer.value?.$refs.wrap$);

const urrentInstance = getCurrentInstance() as any;

onMounted(() => {
  scrollWrapper.value &&
    scrollWrapper.value.addEventListener('scroll', emitScroll, true);
});

onUnmounted(() => {
  scrollWrapper.value &&
    scrollWrapper.value.removeEventListener('scroll', emitScroll);
});



function handleScroll(e: any) {
  const eventDelta = e.wheelDelta || -e.deltaY * 40;
  const $scrollWrapper = scrollWrapper.value;
  if ($scrollWrapper) {
    $scrollWrapper.scrollLeft = $scrollWrapper.scrollLeft + eventDelta / 4;
  }
}

function emitScroll() {
  $emit('scroll');
}

function moveToTarget(currentTag: VisitedViews) {
  const $parentCtx = urrentInstance && urrentInstance.parent;
  const $container = scrollWrapper.value;
  const $containerWidth = $container && $container.offsetWidth;
  const $scrollWrapper = scrollWrapper.value;
  const tagList = $parentCtx.refs.tagRef;

  let firstTag = null;
  let lastTag = null;

  // find first tag and last tag
  if (tagList.length > 0) {
    firstTag = tagList[0];
    lastTag = tagList[tagList.length - 1];
  }

  if (firstTag === currentTag) {
    if ($scrollWrapper) {
      $scrollWrapper.scrollLeft = 0;
    }
  } else if (lastTag === currentTag) {
    if ($scrollWrapper && $containerWidth) {
      $scrollWrapper.scrollLeft = $scrollWrapper.scrollWidth - $containerWidth;
    }
  } else {
    // find preTag and nextTag
    const currentIndex = tagList.findIndex(
      (item: VisitedViews) => item === currentTag
    );
    const prevTag = tagList[currentIndex - 1];
    const nextTag = tagList[currentIndex + 1];

    // the tag's offsetLeft after of nextTag
    const afterNextTagOffsetLeft =
      nextTag.$el.offsetLeft + nextTag.$el.offsetWidth + tagAndTagSpacing;

    // the tag's offsetLeft before of prevTag
    const beforePrevTagOffsetLeft = prevTag.$el.offsetLeft - tagAndTagSpacing;

    if (
      $scrollWrapper &&
      $containerWidth &&
      afterNextTagOffsetLeft > $scrollWrapper.scrollLeft + $containerWidth
    ) {
      $scrollWrapper.scrollLeft = afterNextTagOffsetLeft - $containerWidth;
    } else if (
      $scrollWrapper &&
      beforePrevTagOffsetLeft < $scrollWrapper.scrollLeft
    ) {
      $scrollWrapper.scrollLeft = beforePrevTagOffsetLeft;
    }
  }
}
</script>

<style lang="scss" scoped>
.scroll-container {
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: 100%;
  ::v-deep {
    .el-scrollbar__bar {
      bottom: 0px;
    }
    .el-scrollbar__wrap {
      height: 49px;
    }
  }
}
</style>
