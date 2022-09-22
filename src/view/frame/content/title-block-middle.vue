<template>
  <div class="scroll-outer" ref="outerDivRef" @mousedown="outerDivMouseDown">
    <div class="scroll-body">
      <template v-for="index in 200" :key="index">
        <a-tag :size="'large'" style="margin-left: 10px" :bordered="true" closable> Tag </a-tag>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, onUnmounted, ref} from "vue";
import * as $L from 'owner-tool-js';

const outerDivRef = ref();

// outerDiv被鼠标点下去的时候的滚动轴位置
let outerDivScrollMouseDownPositionX: any = 0;
// outerDiv被鼠标点击的时候鼠标的位置
let outerDivMouseDownMousePositionX: number = 0;

// 鼠标移动监听事件
let watcher: $L.Watcher;

/**
 * outerDiv被鼠标点下去的事件
 * @param
 * @return
 * @author     :loulan
 * */
const outerDivMouseDown = (event: any) => {
  // 获取鼠标的初始位置
  outerDivMouseDownMousePositionX = parseFloat(event.pageX.toString());
  outerDivScrollMouseDownPositionX = $L.windowsTool.getScrollPosition(outerDivRef.value).x;
  // 打开鼠标移动监听事件
  watcher.open();
}


onMounted(() => {
  watcher = $L.windowsTool.watchMousePosition((x: number, y: number) => {
    // 鼠标点下去向右移动距离（向左就变成负数了）
    let moveRight: number = x - outerDivMouseDownMousePositionX;

    // 滚动轴向左，鼠标拖拽的东西才是向右，所以滚动轴移动位置和鼠标相反
    let scrollX = outerDivScrollMouseDownPositionX - moveRight;
    $L.windowsTool.setScrollPosition(scrollX <= 0 ? 0 : scrollX, 0, outerDivRef.value);
  });
  watcher.close();
  // 只要鼠标弹起就停止tag移动事件
  window.addEventListener("mouseup", () => {
    watcher.close();
  });
})

onUnmounted(() => {
  watcher.close();
  window.removeEventListener("mouseup", () => {
    watcher.close();
  });
})
</script>

<style scoped>

.scroll-outer {
  height: 100%;
  display: block;
  overflow: hidden;
  overflow-x: scroll;
  position: absolute;
  left: 0px;
  right: 10px;
  top: 1px;
  bottom: 0px;
  /*border: 1px solid blue;*/
  user-select: none;
}

::-webkit-scrollbar {
  width: 0px;
  height: 0px;
}

.scroll-body {
  display: inline-block;
  position: absolute;
  white-space: nowrap;
  overflow: visible;
  /*border: 1px solid red;*/
}
</style>
