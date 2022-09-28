<template>
  <el-config-provider namespace="ep">
    {{ count }}
    <el-button @click="increment">increment</el-button>
  </el-config-provider>
</template>

<script lang="ts" setup>
const count = ref(0);

const increment = ()=>{
  count.value++
}
</script>
