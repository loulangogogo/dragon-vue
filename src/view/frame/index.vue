<template>
  <a-layout style="width: 100%;height: 100%">
    <a-layout-header v-if="frameHeaderHeight > 0" :style="{height:frameHeaderHeight+'px'}">
      <frame-header></frame-header>
    </a-layout-header>
    <a-layout>
      <a-layout-sider v-if="frameSiderMaxWidth > 0" :resize-directions="['right']" :style="{width: frameSiderMaxWidth+'px',maxWidth: frameSiderMaxWidth+'px'}">
        <frame-sider></frame-sider>
      </a-layout-sider>
      <a-layout-content>
        <frame-content></frame-content>
      </a-layout-content>
    </a-layout>
    <a-layout-footer v-if="frameFooterHeight > 0" :style="{height:frameFooterHeight+'px'}">
      <frame-footer></frame-footer>
    </a-layout-footer>
  </a-layout>
</template>

<script lang="ts" setup>
import frameHeader from './header.vue';
import frameSider from './sider.vue';
import frameContent from './content.vue';
import frameFooter from './footer.vue';
import {useStore} from 'vuex';

const storeGetters = useStore().getters;
const frameHeaderHeight = storeGetters.frameHeaderHeight;
const frameFooterHeight = storeGetters.frameFooterHeight;
const frameSiderMaxWidth = storeGetters.frameSiderMaxWidth;
const frameContentHeight = storeGetters.frameContentHeight;


</script>

<style scoped>

</style>
