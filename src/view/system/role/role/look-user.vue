<template>
  <a-modal v-model:visible="modalVisible"
           title="角色用户"
           title-align="start"
           width="950px"
           :mask-closable="false"
           :footer="false"
           @close="close">
    <dragon-user ref="dragonUserRef" :content-height="600" :is-role="true"></dragon-user>
  </a-modal>
</template>

<script lang="ts" setup>
import DragonUser from '../../user/index.vue';
import {ref} from "vue";

// 模态框的显示状态
const modalVisible = ref(false);
const dragonUserRef = ref();


/**
 * 对话框关闭触发的事件
 * @param
 * @return
 * @author     :loulan
 * */
const close = () => {

}

defineExpose({
  init: (data: any) => {
    dragonUserRef.value.searchByRole(data.id);
    modalVisible.value = true;
  }
});
</script>

<style scoped>

</style>
