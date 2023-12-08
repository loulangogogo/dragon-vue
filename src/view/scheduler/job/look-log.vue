<template>
  <a-modal v-model:visible="modalVisible"
           title="运行日志"
           title-align="start"
           width="800px"
           :mask-closable="false"
           :footer="false"
           @close="close">
    <job-log ref="jobLogRef" :content-height="550"></job-log>
  </a-modal>
</template>

<script lang="ts" setup>
import JobLog from '../log/index.vue';
import {ref} from "vue";

// 模态框的显示状态
const modalVisible = ref(false);
const jobLogRef = ref();

/**
 * 对话框关闭触发的事件
 * @param
 * @return
 * @author     :loulan
 * */
const close = () => {
  jobLogRef.value.close();
}


defineExpose({
  init: (data: any) => {
    modalVisible.value = true;
    jobLogRef.value.init(data.id);
  }
});
</script>

<style scoped lang="scss">

</style>