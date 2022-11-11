<template>
  <a-layout style="width: 100%;height: 100%">
    <a-layout-header v-if="frameHeaderHeight > 0" :style="{height:frameHeaderHeight+'px'}">
      <frame-header></frame-header>
    </a-layout-header>
    <a-layout>
      <a-split :disabled="collapsed" v-model:size="splitValue" :max="frameSiderMaxWidth">
        <template #first>
          <frame-sider :collapsed="collapsed" :collapsed-width="collapsedWidth"></frame-sider>
        </template>
        <template #second>
          <frame-content @change-collapsed="changeCollapsed"></frame-content>
        </template>
      </a-split>
    </a-layout>
    <a-layout-footer v-if="frameFooterHeight > 0" :style="{height:frameFooterHeight+'px'}">
      <frame-footer></frame-footer>
    </a-layout-footer>
  </a-layout>
</template>

<script lang="ts" setup>
import FrameHeader from './header.vue';
import FrameSider from './sider.vue';
import FrameContent from './content.vue';
import FrameFooter from './footer.vue';
import {useStore} from 'vuex';
import {ref} from "vue";

// 是否折叠
const collapsed = ref(false);

const storeGetters = useStore().getters;
const frameHeaderHeight = storeGetters.frameHeaderHeight;
const frameFooterHeight = storeGetters.frameFooterHeight;
const frameSiderMaxWidth = storeGetters.frameSiderMaxWidth;


// 分割组件的变量（初始值是左边最大）
const splitValue = ref(frameSiderMaxWidth);
let beforeCollapsedSplitValue:number|string = splitValue.value;
const collapsedWidth: number = 48; // 菜单部分的折叠宽度


/**
 * 改变菜单状态的收缩按钮点击事件
 * @param
 * @return
 * @author     :loulan
 * */
const changeCollapsed = (value:boolean):void => {
  collapsed.value = value;
  if (value) {
    // 当菜单栏要进行折叠的时候
    beforeCollapsedSplitValue = splitValue.value;
    splitValue.value = collapsedWidth;
  } else {
    // 放开折叠的时候
    splitValue.value = beforeCollapsedSplitValue;
  }
}

</script>

<style scoped>

</style>
