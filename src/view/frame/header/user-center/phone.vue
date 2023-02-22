<template>
  <a-card hoverable class="card">
    <template #extra>
      <a-button type="outline">解绑手机</a-button>
    </template>
    <icon-phone style="width: 50%;height: 50%;max-width: 150px;min-width: 50px;position: relative;top: 30px"/>
  </a-card>
</template>

<script setup lang="ts">
</script>

<style scoped>
/*卡片样式*/
.card {
  height: 100%;
  overflow: hidden;
  text-align: center;
}
</style>
