<template>
  <main>
    <div ref="testRef" class="test" @mousedown="mousedown" @mouseup="mouseup" />
  </main>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useDrag } from '@/utils/drag'

const testRef = ref(null)
const { mousedown, mouseup, mousemove } = useDrag()
</script>
<style lang="less" scoped>
main {
  .test {
    width: 100px;
    height: 100px;
    cursor: pointer;
    background-color: darkred;
    transform: translate(123px,178px);
  }
}
</style>
