<template>
  <a-modal v-model:visible="modalVisible"
           title="编辑权限"
           title-align="start"
           width="90%"
           :mask-closable="false"
           body-class="permissionModalBodyClass"
           @close="close">
    <!--48表示头部高度，53表示脚部高度，20表示空隙高度-->
    <div :style="{height:screenHeight - 48 - 53  - 20 +'px'}">
      <menu-permission ref="menuPermissionRef" :content-height="screenHeight - 48 - 53 - 20"></menu-permission>
    </div>
    <template #footer>
      <a-button type="outline" @click="modalVisible=false">取消</a-button>
      <a-button type="primary" @click="submit">确定</a-button>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>

import {computed, ref} from "vue";
import {useStore} from "vuex";
import MenuPermission from '../../menu/index.vue';

const modalVisible = ref(false);

const menuPermissionRef = ref();

const storeGetters = useStore().getters;
const screenHeight = computed(() => storeGetters.screenHeight);


const submit = ()=>{
  let checkedNodes = menuPermissionRef.value.getCheckedNodes();
  console.error(checkedNodes);
}

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

<style>
.permissionModalBodyClass {
  padding: 0px;
}

</style>
