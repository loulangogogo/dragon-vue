<script setup lang="ts">
import DragonDept from '../dept/index.vue';

const props = withDefaults(defineProps<{
  // 高度设置
  contentHeight: number;
}>(), {
  contentHeight: 0,
})
</script>

<template>
  <dragon-dept :content-height="props.contentHeight" :is-next-dept="true"></dragon-dept>
</template>

<style scoped>

</style>