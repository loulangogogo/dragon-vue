<template>
  <div class="scroll-outer" ref="outerDivRef" @mousedown="outerDivMouseDown">
    <div class="scroll-body">
      <a-tag :id="'/'"
             :color="'/' == route.path?'green':'gray'"
             size="large"
             style="margin-left: 10px"
             :bordered="true"
             @click="clickTag('/')">
        <template #icon>
          <span class="iconfont icon-home" style="font-size: 15px"></span>
        </template>
        首页
      </a-tag>
      <template v-for="(tag,index) in tagOptions">
        <a-tag :id="tag.path"
               :color="tag.path === route.path?'green':'gray'"
               size="large"
               style="margin-left: 10px"
               :bordered="true"
               @click="clickTag(tag.path)">
          {{ tag.name }}
          <icon-close class="tagCloseIcon" @click.stop="closeTag(index)"/>
        </a-tag>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {nextTick, onMounted, onUnmounted, ref, watch} from "vue";
import {Watcher,windowsTool} from 'owner-tool-js';
import {useRoute, useRouter} from "vue-router";
import {MenuIconTypeEnum} from "../../../common/domain/enums";

interface routeTag {
  name: any,
  path: any,
  iconType?: any,
  icon?: any
}

const outerDivRef = ref();
// 用户获取当前路由的数据
const route = useRoute();
const router = useRouter();
// 标签选项显示
const tagOptions = ref<Array<routeTag>>([]);


// outerDiv被鼠标点下去的时候的滚动轴位置
let outerDivScrollMouseDownPositionX: any = 0;
// outerDiv被鼠标点击的时候鼠标的位置
let outerDivMouseDownMousePositionX: number = 0;

// 鼠标移动监听事件
let watcher: Watcher;
/**
 * outerDiv被鼠标点下去的事件
 * @param
 * @return
 * @author     :loulan
 * */
const outerDivMouseDown = (event: any) => {
  // 获取鼠标的初始位置
  outerDivMouseDownMousePositionX = parseFloat(event.pageX.toString());
  outerDivScrollMouseDownPositionX = windowsTool.getScrollPosition(outerDivRef.value).x;
  // 打开鼠标移动监听事件
  watcher.open();
}

/**
 * 点击标签要进行跳转
 * @param
 * @return
 * @author     :loulan
 * */
const clickTag = (path: string) => {
  router.push(path);
}

/**
 * 关闭标签页的时候
 * @param
 * @return
 * @author     :loulan
 * */
const closeTag = (index: number) => {
  const tagData: any = tagOptions.value[index];
  // 判断关闭是否是当前路由的标签，如果是需要向前一个，否则直接关闭就可以
  if (tagData.path === route.path) {
    if (index > 0) {
      router.push(tagOptions.value[index - 1]);
    } else {
      // 判断是否就剩下一个了，如果是，那么路由到首页，否则路由到后面一个
      router.push(tagOptions.value.length > 1 ? tagOptions.value[index + 1] : '/')
    }
  }
  // 从标签选项中删除指定索引的标签数据
  tagOptions.value.splice(index, 1);
}

/**
 * 监听路由的变化然后改变标签显示
 * @param
 * @return
 * @author     :loulan
 * */
watch(() => route.path,
    (val: any) => {
      // 先判断当前的路由是否已经在标签表中存在，如果存在就不需要再进行添加了（首页是肯定存在的，所以如果路由的首页是不需要添加标签的）
      if (!(val == '/' || tagOptions.value.some((o: any) => o.path === val))) {
        // 如果路由在标签选项中不存在那么就从数组头写入
        const tempTagData: routeTag = {
          name: route.name,
          path: val,
          iconType: route.meta?.iconType,
          icon: route.meta?.icon
        };
        tagOptions.value.unshift(tempTagData);
      } else {
        // 如果路由数据已经在标签中存在了，那么不做任何操作执行下一步
      }

      // 如果路由发生变化，移动当前标签到可视区域范围内
      nextTick(() => {
        /*
        * 当标签页面渲染完毕之后，才能根据id获取组件dom
        * 获取标签组件的开始和结束的位置 与 滚动条可视区域开始和结束位置对比
        * 如果标签组件被没有完全在可视区域那么就移动到可视区域，否则不做移动
        * */
        const tagDom: any = document.getElementById(val);
        const tagDomStartPosition: number = tagDom.offsetLeft; // 标签开始位置
        const tagDomEndPosittion: number = tagDomStartPosition + tagDom.offsetWidth; // 标签结束位置
        const {x, y} = windowsTool.getScrollPosition(outerDivRef.value);
        const outerDivWidth: number = outerDivRef.value.offsetWidth;
        const viewStartPosition: number = <number>x;  // 可视区域开始位置
        const viewEndPostition: any = viewStartPosition + outerDivWidth; // 可视区域结束位置

        if (tagDomStartPosition < viewStartPosition) {
          // 如果标签的开始位置小于可视区域的开始位置，那么将标签开始位置移动到可视区域开始位置
          windowsTool.setScrollPosition(tagDomStartPosition, 0, outerDivRef.value)
        } else if (tagDomEndPosittion > viewEndPostition) {
          // 如果标签结束位置大于可视区域的结束位置，那么将标签的结束位置移动到可视区域结束位置
          windowsTool.setScrollPosition(tagDomEndPosittion - outerDivWidth, <number>y, outerDivRef.value);
        } else {
          // 其他情况不移动滚动条的位置
        }
      });
    },
    {
      deep: true,
      immediate: true
    }
)

onMounted(() => {
  watcher = windowsTool.watchMousePosition((x: number, y: number) => {
    // 鼠标点下去向右移动距离（向左就变成负数了）
    let moveRight: number = x - outerDivMouseDownMousePositionX;

    // 滚动轴向左，鼠标拖拽的东西才是向右，所以滚动轴移动位置和鼠标相反
    let scrollX = outerDivScrollMouseDownPositionX - moveRight;
    windowsTool.setScrollPosition(scrollX <= 0 ? 0 : scrollX, 0, outerDivRef.value);
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

/*标签关闭图标样式*/
.tagCloseIcon {
  cursor: pointer;
  margin-left: 5px;
}

.tagCloseIcon:hover {
  color: blue;
  font-weight: bolder;
}
</style>
