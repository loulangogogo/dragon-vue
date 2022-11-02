<template>
  <div class="contentDiv">
    <a-split class="splitClass" size="300px">
      <template #first>
        <a-menu>
          <a-menu-item key="0">账号信息</a-menu-item>
          <a-menu-item key="1">消息</a-menu-item>
        </a-menu>
      </template>
      <template #second>
        <account-info></account-info>
      </template>
    </a-split>
  </div>
</template>

<script setup lang="ts">

import AccountInfo from "./account-info.vue";

const props = defineProps({
  contentHeight: {
    type: Number,
    required: true,
    default: 0
  }
});

</script>

<style scoped>
.contentDiv {
  height: v-bind(contentHeight - 40 + 'px');
  padding: 20px;
  background-color: gray;
}

.splitClass {
  height: 100%;
  background-color: white;
}
</style>
