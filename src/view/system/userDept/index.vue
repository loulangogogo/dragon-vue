<script setup lang="ts">
import DragonUser from '../user/index.vue';
const props = withDefaults(defineProps<{
  contentHeight: number;
}>(), {
  contentHeight: 0,
})

</script>

<template>
<dragon-user :content-height="props.contentHeight" :is-next-dept="true"></dragon-user>
</template>

<style scoped>

</style>