<template>
  <a-modal v-model:visible="modalVisible"
           title="编辑权限"
           title-align="start"
           width="90%"
           :mask-closable="false"
           @close="close">
    <!--48表示头部高度，53表示脚部高度，20表示空隙高度-->
    <div :style="{height:screenHeight - 48 - 53  - 20 +'px'}">
      <menu-permission :content-height="screenHeight - 48 - 53 - 20"></menu-permission>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>

import {computed, ref} from "vue";
import {useStore} from "vuex";
import MenuPermission from '../../menu/index.vue';

const modalVisible = ref(false);

const storeGetters = useStore().getters;
const screenHeight = computed(() => storeGetters.screenHeight);

/**
 * 模态框关闭事件
 * @param
 * @return
 * @author     :loulan
 * */
const close = () => {

}

defineExpose({
  init: () => {
    modalVisible.value = true;
  }
});
</script>

<style scoped>
:deep .arco-modal-body {
  padding: 0;
}
</style>
