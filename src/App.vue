<template>
  <div v-if="loadingSuccess===false" :style="{height: screenHeight+'px'}" style="display: flex;justify-content: center;align-items: center">
    <a-spin dot :loading="!loadingSuccess" :size="40"/>
  </div>
  <div v-show="loadingSuccess" id="appHome">
    <router-view/>
  </div>
</template>

<script setup lang="ts">

import {computed, onMounted, ref, watch} from "vue";
import {useSystemStore} from "./store";
import {windowsTool} from 'owner-tool-js';
/***************************************************************************************************************/

let screenHeight = ref(0);

const store = useSystemStore();

// 项目是否加载成功的状态。（没有加载成功要显示加载图标）
const loadingSuccess = computed<boolean>(():boolean=>{
  return store.loadingSuccess;
})

/***************************************************************************************************************/
onMounted(()=>{
  // 浏览器的页面监听器不会再刚打开页面的时候监听，注释再页面宽高发生变化的时候才会监听，所以再这里额外的添加一个获取高度的代码
  screenHeight.value = windowsTool.pageViewHeight();
  store.screenHeight = screenHeight.value;
  store.screenWidth = windowsTool.pageViewWidth();
  windowsTool.watchPageView((width:number,height:number)=>{
    screenHeight.value = height;
    store.screenHeight = height;
    store.screenWidth = width;
    console.log("当前高度为：" + height);
  })
})
/***************************************************************************************************************/
</script>

<style lang="scss">
#appHome {
  height: v-bind("screenHeight+'px'");
  overflow: auto;
}

/*滚动条的样式设置*/
::-webkit-scrollbar {
  width: 7px;
  height: 7px;
}
::-webkit-scrollbar-thumb {
  border-radius: 7px;
  -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  background-color: #99a9bf;
}
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  border-radius: 7px;
  background-color: #d3dce6;
}
</style>
